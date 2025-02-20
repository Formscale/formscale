import App from "@/app";
import { AuthController } from "@/controllers";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";

const app = App;

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

export default app;
