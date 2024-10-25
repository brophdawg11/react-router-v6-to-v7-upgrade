import type { RouteConfig } from "@react-router/dev/routes";

export const routes: RouteConfig = [
  {
    path: "/",
    file: "../src/routes/layout.tsx",
    children: [
      {
        index: true,
        file: "../src/routes/home.tsx",
      },
      {
        path: "todos",
        file: "../src/routes/todos.tsx",
        children: [
          {
            path: ":id",
            file: "../src/routes/todo.tsx",
          },
        ],
      },
      {
        path: "deferred",
        file: "../src/routes/defer.tsx",
      },
    ],
  },
];
