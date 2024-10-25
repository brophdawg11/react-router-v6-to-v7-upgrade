import { Outlet, Scripts } from "react-router";

import "../src/index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React Router - Basic Example</title>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Performing initial data load</p>;
}
