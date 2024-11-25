import { MainLayout } from "@/components/layouts/layout";

import { KanbanBoard } from "@/features/workspace/components/kanban-board";

export const BoardViewRoute = () => {
  return (
    <MainLayout>
      <section className="bg-background border-3 border-black px-4">
        <KanbanBoard />
      </section>
    </MainLayout>
  );
};
