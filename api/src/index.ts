import App from "@/app";

import { jwt } from "hono/jwt";

const app = App;

const guestPage = ["/auth/login", "/auth/register"];

app.use("*", (ctx, next) => {
  const path = ctx.req.path;
  if (guestPage.includes(path)) {
    return next();
  }

  const jwtMiddleware = jwt({
    secret: ctx.env.JWT_SECRET,
  });

  return jwtMiddleware(ctx, next);
});

export default app;
