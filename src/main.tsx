import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useFetchers,
  useNavigation,
  useRevalidator,
} from "react-router-dom";

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
      Component: Layout,
      HydrateFallback: Fallback,
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

export function Layout() {
  let navigation = useNavigation();
  let revalidator = useRevalidator();
  let fetchers = useFetchers();
  let fetcherInProgress = fetchers.some((f) =>
    ["loading", "submitting"].includes(f.state)
  );

  return (
    <>
      <h1>Data Router Example</h1>

      <p>
        This example demonstrates some of the core features of React Router
        including nested &lt;Route&gt;s, &lt;Outlet&gt;s, &lt;Link&gt;s, and
        using a "*" route (aka "splat route") to render a "not found" page when
        someone visits an unrecognized URL.
      </p>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
          <li>
            <Link to="/deferred">Deferred</Link>
          </li>
          <li>
            <Link to="/404">404 Link</Link>
          </li>
          <li>
            <button onClick={() => revalidator.revalidate()}>
              Revalidate Data
            </button>
          </li>
        </ul>
      </nav>
      <div style={{ position: "fixed", top: 0, right: 0 }}>
        {navigation.state !== "idle" && <p>Navigation in progress...</p>}
        {revalidator.state !== "idle" && <p>Revalidation in progress...</p>}
        {fetcherInProgress && <p>Fetcher in progress...</p>}
      </div>
      <p>
        Click on over to <Link to="/todos">/todos</Link> and check out these
        data loading APIs!
      </p>
      <p>
        Or, checkout <Link to="/deferred">/deferred</Link> to see how to
        separate critical and lazily loaded data in your loaders.
      </p>
      <p>
        We've introduced some fake async-aspects of routing here, so Keep an eye
        on the top-right hand corner to see when we're actively navigating.
      </p>
      <hr />
      <Outlet />
    </>
  );
}

// HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
