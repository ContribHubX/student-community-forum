import { Workspace } from "@/features/workspace/components/workspace";
import { useAuth } from "@/hooks/use-auth";
import { HomeLayout } from "@/components/layouts/home-layout";

export const WorkspaceRoute = () => {
  const { authState } = useAuth();

  return (
    <HomeLayout>
      <section className="bg-background border-3 border-black px-4">
        <Workspace userId={authState.user?.id} />
      </section>
    </HomeLayout>
  );
};
