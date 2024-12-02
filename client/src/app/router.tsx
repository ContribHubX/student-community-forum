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
          path: "/popular",
          lazy: async () => {
            const { PopularRoute } = await import(
              "./routes/app/popular"
            );
            return { Component: PopularRoute };
          },
        },
        {
          path: "thread-action/:threadId",
          lazy: async () => {
            const { CreateThreadRoute } = await import(
              "./routes/app/thread/create-thead"
            );
            return { Component: CreateThreadRoute };
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
            const { ThreadRoute } = await import(
              "./routes/app/thread/thread-route"
            );
            return { Component: ThreadRoute };
          },
        },
        {
          path: "community/:id",
          loader: ({ params }) => {
            if (!params.id) {
              throw new Error("params id is null");
            }
            return params.id;
          },
          lazy: async () => {
            const { Community } = await import(
              "./routes/app/community/community"
            );
            return { Component: Community };
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
            const { QuestionRoute } = await import(
              "./routes/app/question/question"
            );
            return { Component: QuestionRoute };
          },
        },
        {
          path: "/question/:questionId",
          lazy: async () => {
            const { QuestionViewRoute } = await import(
              "./routes/app/question/question-view"
            );
            return { Component: QuestionViewRoute };
          },
        },
        {
          path: "/question/request",
          lazy: async () => {
            const { RequestRoute } = await import(
              "./routes/app/question/request"
            );
            return { Component: RequestRoute };
          },
        },
        {
          path: "/community/all",
          lazy: async () => {
            const { CommunitiesRoute } = await import(
              "./routes/app/community/communities"
            );
            return { Component: CommunitiesRoute };
          },
        },
        {
          path: "/workspace",
          lazy: async () => {
            const { WorkspaceRoute } = await import(
              "./routes/app/workspace/workspace"
            );
            return { Component: WorkspaceRoute };
          },
        },
        {
          path: "/workspace/:boardId",
          lazy: async () => {
            const { BoardViewRoute } = await import(
              "./routes/app/workspace/board-view"
            );
            return { Component: BoardViewRoute };
          },
        },
        {
          path: "/study-room/:roomId",
          lazy: async () => {
            const { StudyRoomRoute } = await import(
              "./routes/app/study-room"
            );
            return { Component: StudyRoomRoute };
          },
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
