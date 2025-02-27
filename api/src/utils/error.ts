import { Context, Next } from "hono";
import Response from "./response";

export default async function errorHandler(ctx: Context, next: Next) {
  try {
    return await next();
  } catch (error) {
    console.error("Request error:", {
      path: ctx.req.path,
      method: ctx.req.method,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return new Response(ctx).error(error.message, 401);
      }

      if (error.message.includes("Not found")) {
        return new Response(ctx).error(error.message, 404);
      }

      if (error.message.includes("Invalid")) {
        return new Response(ctx).error(error.message, 400);
      }
    }

    return new Response(ctx).error("An unexpected error occurred.", 500);
  }
}
