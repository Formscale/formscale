import app from "@/app";
import {
  AuthController,
  FormController,
  LogsController,
  SubmissionsController,
  SubmitController,
  UserController,
} from "@/controllers";
import Response from "@/utils/response";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";

const baseCorsOptions = {
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length", "X-Requested-With"],
  maxAge: 3600,
};

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://formscale.dev"],
    credentials: true,
    ...baseCorsOptions,
  })
);

app.use(
  "/s/:id",
  cors({
    origin: "*",
    ...baseCorsOptions,
  })
);

const publicRoutes = ["/auth/login", "/auth/signup", "/auth/resend", "/auth/verify", "/s/:id", "/s/:id/click"];

app.use("*", (ctx, next) => {
  const path = ctx.req.path;

  if (publicRoutes.includes(path) || (path.startsWith("/s") && !path.includes("/submissions"))) {
    return next();
  }

  const jwtMiddleware = jwt({
    secret: ctx.env.JWT_SECRET,
  });

  return jwtMiddleware(ctx, next);
});

app.route("/s", SubmitController);
app.route("/auth", AuthController);
app.route("/forms", FormController);
app.route("/user", UserController);
app.route("/submissions", SubmissionsController);
app.route("/logs", LogsController);

app.all("*", async (ctx) => {
  return new Response(ctx).error("Route not found", 404);
});

export default app;
