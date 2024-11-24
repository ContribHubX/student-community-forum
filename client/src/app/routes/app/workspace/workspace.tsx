import { Workspace } from "@/features/workspace/components/workspace";
import { MainLayout } from "@/components/layouts/layout";
import { useAuth } from "@/hooks/use-auth";

export const WorkspaceRoute = () => {
  const { authState } = useAuth();

  return (
    <MainLayout>
      <section className="bg-background border-3 border-black px-4">
        <Workspace userId={authState.user?.id} />
      </section>
    </MainLayout>
  );
};
