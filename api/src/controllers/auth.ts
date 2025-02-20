import App from "@/app";
import db from "@/db";
import { create, findUnique, update } from "@/db/crud";
import validator from "@/middleware/validation";
import Response from "@/utils/response";
import { LoginSchema, SafeUserSchema, SignupSchema, User } from "@formhook/types";
import { compareSync, hashSync } from "bcrypt-edge";
import { sign } from "hono/jwt";

const getToken = async (user: User, secret: string) => {
  const safeUser = SafeUserSchema.parse(user);

  const payload = {
    data: safeUser,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  };

  const token = await sign(payload, secret);

  return { token, user: safeUser };
};

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  return { otp, otpExpiry };
};

// const sendOtpEmail = async (email: string, otp: string) => {
//   const resend = new Resend(ctx.env.RESEND_API_KEY);

//   const { data, error } = await resend.emails.send({
//     from: "FormHook <formhook@driselamri.com>",
//     to: email,
//   });
// };

const sendOtp = async (email: string, otp: string) => {
  // send with resend
  console.log("send otp email", email, otp);
};

export const AuthController = App.post(
  "/login",
  validator(LoginSchema, (error, ctx) => {
    return new Response(ctx).error(error);
  }),
  async (ctx) => {
    const { email, password } = await ctx.req.json();

    const existingUser = await findUnique(db(ctx.env), "user", {
      where: { email },
    });

    if (!existingUser) {
      return new Response(ctx).error("User not found. Try signing up instead.", 404);
    }

    const isPasswordValid = compareSync(password, existingUser?.password);

    if (!isPasswordValid) {
      return new Response(ctx).error("Invalid password. Try again or reset your password.", 401);
    }

    if (!existingUser.verified) {
      return new Response(ctx).error("Email not verified. Try verifying your email and logging in again.", 403);
    }

    const { token, user } = await getToken(existingUser, ctx.env.JWT_SECRET);

    return new Response(ctx).success({ token, user });
  }
)
  .post(
    "/signup",
    validator(SignupSchema, (error, ctx) => {
      return new Response(ctx).error(error);
    }),
    async (ctx) => {
      const { email, password, name } = await ctx.req.json();

      const existingUser = await findUnique(db(ctx.env), "user", {
        where: { email },
      });

      if (existingUser) {
        return new Response(ctx).error("User with email already exists. Try logging in instead.", 400);
      }

      const hashedPassword = hashSync(password, 10);
      const { otp, otpExpiry } = generateOtp();

      const newUser = await create(db(ctx.env), "user", {
        email,
        password: hashedPassword,
        name,
        otp,
        otpExpiry,
      });

      await sendOtp(newUser.email, otp);

      return new Response(ctx).success({ email: newUser.email });
    }
  )
  .post("/resend", async (ctx) => {
    const { email } = await ctx.req.json();

    const user = await findUnique(db(ctx.env), "user", {
      where: { email },
    });

    if (!user) {
      return new Response(ctx).error("User not found. Try signing up instead.", 404);
    }

    if (user.verified) {
      return new Response(ctx).error("Email already verified. Try logging in instead.", 400);
    }

    if (user.otpExpiry && new Date().getTime() < user.otpExpiry.getTime() + 60 * 1000) {
      const remainingSeconds = Math.ceil((user.otpExpiry.getTime() + 60 * 1000 - new Date().getTime()) / 1000);
      return new Response(ctx).error(`Please wait ${remainingSeconds} seconds before requesting a new code.`, 429);
    }

    const { otp, otpExpiry } = generateOtp();

    await update(db(ctx.env), "user", {
      where: { email },
      data: { otp, otpExpiry, attempts: 3 },
    });

    await sendOtp(user.email, otp);

    return new Response(ctx).success({ message: "New verification code sent." });
  })
  .post("/verify", async (ctx) => {
    const { email, otp } = await ctx.req.json();

    const existingUser = await findUnique(db(ctx.env), "user", {
      where: { email },
    });

    if (!existingUser) {
      return new Response(ctx).error("User not found. Try signing up instead.", 404);
    }

    if (existingUser.verified) {
      return new Response(ctx).error("User already verified. Try logging in instead.", 400);
    }

    if (!existingUser.otp || existingUser.otp !== otp) {
      const attempts = existingUser.attempts - 1;

      await update(db(ctx.env), "user", {
        where: { email },
        data: { attempts },
      });

      return new Response(ctx).error(`Invalid OTP. ${attempts} attempts remaining.`, 401);
    }

    if (new Date() > existingUser.otpExpiry) {
      return new Response(ctx).error("OTP has expired. Try requesting a new one.", 401);
    }

    if (existingUser.attempts <= 0) {
      return new Response(ctx).error("Too many attempts. Try resending a new OTP.", 429);
    }

    const updatedUser = await update(db(ctx.env), "user", {
      where: { email },
      data: {
        verified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    const { token, user: safeUser } = await getToken(updatedUser, ctx.env.JWT_SECRET);

    return new Response(ctx).success({ token, user: safeUser });
  });
