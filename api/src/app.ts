import { Hono } from "hono";

const App = new Hono<{ Bindings: Env }>();
export default App;
