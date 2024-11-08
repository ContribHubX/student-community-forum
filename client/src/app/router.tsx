import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthRoot from "./routes/auth/root";
import AppRoot from "./routes/app/root";
import { useMemo } from "react";
import { ProtectedRoute } from "@/lib/auth";

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
          }
        },
        {
          path: "callback/:provider",
          lazy: async () => {
            const { OAuthCallback } = await import("./routes/auth/callback");
            return { Component: OAuthCallback };
          }
        }
        // {
        //   path: "sign-up",
        //   lazy: async () => {},
        // },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute>
                <AppRoot />
               </ProtectedRoute>,
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
