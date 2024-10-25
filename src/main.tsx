import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function convert(m: any) {
  let { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    Component,
  };
}

let router = createBrowserRouter(
  [
    {
      path: "/",
      HydrateFallback: Fallback,
      lazy: () => import("./routes/layout").then(convert),
      children: [
        {
          index: true,
          lazy: () => import("./routes/home").then(convert),
        },
        {
          path: "todos",
          lazy: () => import("./routes/todos").then(convert),
          children: [
            {
              path: ":id",
              lazy: () => import("./routes/todo").then(convert),
            },
          ],
        },
        {
          path: "deferred",
          lazy: () => import("./routes/defer").then(convert),
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

// App
export default function App() {
  return <RouterProvider router={router} />;
}

// Layout
export function Fallback() {
  return <p>Performing initial data load</p>;
}

// HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
