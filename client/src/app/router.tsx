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
          },
        },
        {
          path: "callback/:provider",
          lazy: async () => {
            const { OAuthCallback } = await import("./routes/auth/callback");
            return { Component: OAuthCallback };
          },
        },
      ],
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          lazy: async () => {
            const { HomeRoute } = await import("./routes/app/home");
            return { Component: HomeRoute };
          },
        },
        {
          path: "thread/:id",
          loader: ({ params }) => {
            if (!params.id) {
              throw new Error("params id is null");
            }
            return params.id;
          },
          lazy: async () => {
            const { ThreadRoute } = await import("./routes/app/thread-route");
            return { Component: ThreadRoute };
          },
        },
        {
          path: "/topic/:topicId",
          lazy: async () => {
            const { TopicRoute } = await import("./routes/app/topic");
            return { Component: TopicRoute };
          },
        },
        {
          path: "/question",
          lazy: async () => {
            const { QuestionRoute } = await import("./routes/app/question/question");
            return { Component: QuestionRoute };
          },
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
