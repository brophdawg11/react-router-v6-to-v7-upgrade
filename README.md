# React Router v6 → v7 Upgrade

This is a sample repo demonstrating the steps required to incrementally upgrade from React Router v6 to v7 and the Vite plugin.

Adopting the vite plugin _does not_ mean you need to begin server-rendering your application! You can still run your application entirely client side via SPA Mode (`ssr:false`).

By adopting the vite plugin, you gain:

- Automatic route-level code splitting
- Automatic route module lazy loading
- `<Link prefetch>`
- Opt-in SSR
- Opt-in file-based routing
- Opt-in `<head>` management via `<Meta>`/`<Links>`
- Opt-in pre-rendering (SSG)

## Upgrading

We do each step in an isolated commit in this repo so you can easily see the changes required on a per-step basis and use that to apply them to your application.

🚀 **Every commit in this repo represents a step you could merge and ship independently** 🚀

### Assumptions/Prerequisites

- You currently have a v6 SPA without any manual SSR
- You're using Vite to build your app
- You're on the latest versions of React Router v6, Vite, TypeScript
- You're using React 18
- All React Router v6 [future flags](https://reactrouter.com/en/main/upgrading/future) have been adopted
- You've migrated to a [data router](https://reactrouter.com/en/main/routers/picking-a-router) and are using `createBrowserRouter`/`RouterProvider`

### Steps

The idea of the "iterative" upgrade is that you can make these updates as a series of small changes that can be committed and deployed t production, avoiding the need for a long-lived feature branch. This is largely made possible by our [API Development Strategy](https://reactrouter.com/en/main/guides/api-development-strategy) via Future Flags.

1. While still on v6, iteratively move route implementations to individual route modules
   - You can commit/deploy after each route has been updated
2. Update to React Router v7 and change your imports to `from "react-router"`
3. Adopt the v7 Vite plugin and `routes.ts`
4. Adopt the v7 `Route.*` Types
