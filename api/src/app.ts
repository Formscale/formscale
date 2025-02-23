import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();
export default app;
