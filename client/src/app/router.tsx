import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthRoot from "./routes/auth/root";
import AppRoot from "./routes/app/root";
import { useMemo } from "react";

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: "/auth",
      element: <AuthRoot />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { LoginRoute } = await import("./routes/auth/login");
            return { Component: LoginRoute };
          },
        },
      ],
    },
    {
      path: "/",
      element: <AppRoot />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { HomeRoute } = await import("./routes/app/home");
            return { Component: HomeRoute };
          },
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
