import type { RouteConfig } from "@react-router/dev/routes";
import { layout, route, index } from "@react-router/dev/routes";

export const routes: RouteConfig = [
  layout("../src/routes/layout.tsx", [
    index("../src/routes/home.tsx"),
    route("todos", "../src/routes/todos.tsx", [
      route(":id", "../src/routes/todo.tsx"),
    ]),
    route("deferred", "../src/routes/defer.tsx"),
  ]),
];
