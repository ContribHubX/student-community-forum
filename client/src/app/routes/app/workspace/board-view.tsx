import { useState } from "react";

import { KanbanLayout } from "@/components/layouts/kanban-layout";
import { KanbanBoard } from "@/features/workspace/components/kanban-board";

import { useAuth } from "@/hooks/use-auth";

export const BoardViewRoute = () => {
  const { authState } = useAuth();
  const [hideNavbar, setHideNavbar] = useState(false);

  const toggleNavbar = () => setHideNavbar((prev) => !prev);

  if (!authState.user) return <p>Loading...</p>;

  return (
    <KanbanLayout hideNavbar={hideNavbar}>
      <section className="bg-background border-3 border-black px-4">
        <KanbanBoard toggleNavbar={toggleNavbar} currentUser={authState.user} />
      </section>
    </KanbanLayout>
  );
};
