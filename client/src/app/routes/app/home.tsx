import { MainLayout } from "@/components/layouts/layout";
import { Threads } from "@/features/thread/components";
import { useAuth } from "@/hooks/use-auth";

export const HomeRoute = () => {
  const { authState } = useAuth();

  if (!authState?.user?.id) return <p>Loading...</p>;
  console.log(authState.user);
  
  return (
    <MainLayout>
      <section className="text-primary-foreground">
        <Threads userId={authState.user.id} />
      </section>
    </MainLayout>
  );
};
