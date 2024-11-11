import { MainLayout } from "@/components/layouts/layout";
import { ThreadCard } from "@/features/thread/components/thread-card";

export const HomeRoute = () => {
  return (
    <MainLayout>
      <section className="text-primary-foreground ">
        <ThreadCard />
      </section>
    </MainLayout>
  );
};
