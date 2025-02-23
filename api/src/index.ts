import app from "@/app";
import { AuthController, FormController, UserController } from "@/controllers";
import Response from "@/utils/response";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
    maxAge: 3600,
  })
);

const publicRoutes = ["/auth/login", "/auth/signup", "/auth/resend", "/auth/verify"];

app.use("*", (ctx, next) => {
  const path = ctx.req.path;
  if (publicRoutes.includes(path)) {
    return next();
  }

  const jwtMiddleware = jwt({
    secret: ctx.env.JWT_SECRET,
  });

  return jwtMiddleware(ctx, next);
});

app.route("/auth", AuthController);
app.route("/forms", FormController);
app.route("/user", UserController);

app.all("*", async (ctx) => {
  return new Response(ctx).error("Route not found", 404);
});

export default app;
