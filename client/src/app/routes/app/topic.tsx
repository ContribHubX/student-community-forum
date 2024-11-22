import { MainLayout } from "@/components/layouts/layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { Topics } from "@/features/topic/components/topics";
import { RelatedTopics } from "@/features/topic/components/related-topic";
import { useAuth } from "@/hooks/use-auth";

export const TopicRoute = () => {
  const { authState } = useAuth();

  if (!authState?.user?.id) return <p>Loading...</p>;

  return (
    <MainLayout LeftSidebar={LeftSidebar} RightSidebar={RelatedTopics}>
      <section className="md:ml-[16rem] lg:mr-[22rem]">
        <Topics userId={authState.user.id} />
      </section>
    </MainLayout>
  );
};
