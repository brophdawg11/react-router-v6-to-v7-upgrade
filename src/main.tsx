import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  Await,
  createBrowserRouter,
  defer,
  Link,
  Outlet,
  RouterProvider,
  useAsyncError,
  useAsyncValue,
  useFetchers,
  useLoaderData,
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
          loader: deferredLoader,
          Component: DeferredPage,
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

// Deferred
interface DeferredRouteLoaderData {
  critical1: string;
  critical2: string;
  lazyResolved: Promise<string>;
  lazy1: Promise<string>;
  lazy2: Promise<string>;
  lazy3: Promise<string>;
  lazyError: Promise<string>;
}

const rand = () => Math.round(Math.random() * 100);
const resolve = (d: string, ms: number) =>
  new Promise((r) => setTimeout(() => r(`${d} - ${rand()}`), ms));
const reject = (d: Error | string, ms: number) =>
  new Promise((_, r) =>
    setTimeout(() => {
      if (d instanceof Error) {
        d.message += ` - ${rand()}`;
      } else {
        d += ` - ${rand()}`;
      }
      r(d);
    }, ms)
  );

export async function deferredLoader() {
  return defer({
    critical1: await resolve("Critical 1", 250),
    critical2: await resolve("Critical 2", 500),
    lazyResolved: Promise.resolve("Lazy Data immediately resolved - " + rand()),
    lazy1: resolve("Lazy 1", 1000),
    lazy2: resolve("Lazy 2", 1500),
    lazy3: resolve("Lazy 3", 2000),
    lazyError: reject(new Error("Kaboom!"), 2500),
  });
}

export function DeferredPage() {
  let data = useLoaderData() as DeferredRouteLoaderData;
  return (
    <div>
      {/* Critical data renders immediately */}
      <p>{data.critical1}</p>
      <p>{data.critical2}</p>

      {/* Pre-resolved deferred data never triggers the fallback */}
      <React.Suspense fallback={<p>should not see me!</p>}>
        <Await resolve={data.lazyResolved}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      {/* Deferred data can be rendered using a component + the useAsyncValue() hook */}
      <React.Suspense fallback={<p>loading 1...</p>}>
        <Await resolve={data.lazy1}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      <React.Suspense fallback={<p>loading 2...</p>}>
        <Await resolve={data.lazy2}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      {/* Or you can bypass the hook and use a render function */}
      <React.Suspense fallback={<p>loading 3...</p>}>
        <Await resolve={data.lazy3}>{(data: string) => <p>{data}</p>}</Await>
      </React.Suspense>

      {/* Deferred rejections render using the useAsyncError hook */}
      <React.Suspense fallback={<p>loading (error)...</p>}>
        <Await resolve={data.lazyError} errorElement={<RenderAwaitedError />}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>
    </div>
  );
}

function RenderAwaitedData() {
  let data = useAsyncValue() as string;
  return <p>{data}</p>;
}

function RenderAwaitedError() {
  let error = useAsyncError() as Error;
  return (
    <p style={{ color: "red" }}>
      Error (errorElement)!
      <br />
      {error.message} {error.stack}
    </p>
  );
}

// HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
