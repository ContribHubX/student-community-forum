import { MainLayout } from "@/components/layouts/layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { Topics } from "@/features/topic/components/topics";
import { RelatedTopics } from "@/features/topic/components/related-topic";

export const TopicRoute = () => {
  return (
    <MainLayout LeftSidebar={LeftSidebar} RightSidebar={RelatedTopics}>
      <section className="md:ml-[16rem] lg:mr-[22rem]">
        <Topics />
      </section>
    </MainLayout>
  );
};
