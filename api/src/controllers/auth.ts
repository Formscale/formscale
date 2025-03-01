import db from "@/db";
import { create, findUnique, update } from "@/db/crud";
import validator from "@/middleware/validation";
import { sendVerifyEmail } from "@/services";
import Response from "@/utils/response";
import { LoginSchema, SafeUserSchema, SignupSchema, User } from "@formhook/types";
import { compareSync, hashSync } from "bcrypt-edge";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const getToken = async (user: User, secret: string) => {
  const safeUser = SafeUserSchema.parse(user);

  const payload = {
    data: safeUser,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
  };

  const token = await sign(payload, secret);

  return { token, user: safeUser };
};

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  return { otp, otpExpiry };
};

const otpCooldown = (otpExpiry: Date) => {
  const otpGeneratedTime = otpExpiry.getTime() - 15 * 60 * 1000;
  return new Date().getTime() < otpGeneratedTime + 60 * 1000;
};

const getCooldown = (otpExpiry: Date) => {
  // 1 minute cooldown
  const otpGeneratedTime = otpExpiry.getTime() - 15 * 60 * 1000;
  const cooldownEndTime = otpGeneratedTime + 60 * 1000;
  return Math.ceil((cooldownEndTime - new Date().getTime()) / 1000);
};

const auth = new Hono<{ Bindings: Env }>();

export const AuthController = auth
  .post(
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

      const reason = existingUser.twoFactor ? "Two-factor authentication is enabled." : "Email not verified.";

      if (!existingUser.verified || existingUser.twoFactor) {
        if (!existingUser.otpExpiry || !otpCooldown(existingUser.otpExpiry)) {
          const { otp, otpExpiry } = generateOtp();

          await update(db(ctx.env), "user", {
            where: { email },
            data: { otp, otpExpiry, attempts: 3 },
          });

          await sendVerifyEmail([email], otp, ctx.env);

          return new Response(ctx).error(`${reason} A new verification code has been sent.`, 403);
        }

        const remainingSeconds = getCooldown(existingUser.otpExpiry);
        return new Response(ctx).error(
          `${reason}. Please wait ${remainingSeconds.toLocaleString()} seconds before requesting a new code.`,
          403
        );
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

      await sendVerifyEmail([email], otp, ctx.env);

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

    if (user.verified && !user.twoFactor) {
      return new Response(ctx).error("Email already verified. Try logging in instead.", 400);
    }

    if (user.otpExpiry && otpCooldown(user.otpExpiry)) {
      const remainingSeconds = getCooldown(user.otpExpiry);
      return new Response(ctx).error(
        `Please wait ${remainingSeconds.toLocaleString()} seconds before requesting a new code.`,
        429
      );
    }

    const { otp, otpExpiry } = generateOtp();

    await update(db(ctx.env), "user", {
      where: { email },
      data: { otp, otpExpiry, attempts: 3 },
    });

    await sendVerifyEmail([user.email], otp, ctx.env);

    return new Response(ctx).success({ email: user.email });
  })
  .post("/verify", async (ctx) => {
    const { email, otp } = await ctx.req.json();

    const existingUser = await findUnique(db(ctx.env), "user", {
      where: { email },
    });

    if (!existingUser) {
      return new Response(ctx).error("User not found. Try signing up instead.", 404);
    }

    if (existingUser.verified && !existingUser.twoFactor) {
      return new Response(ctx).error("User already verified. Try logging in instead.", 400);
    }

    if (existingUser.attempts <= 0) {
      return new Response(ctx).error("Too many attempts. Try sending a new OTP later.", 429);
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

// forgot password later
// use refresh token & access tokens
