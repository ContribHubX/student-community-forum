import { MainLayout } from "@/components/layouts/layout";
import { Aside } from "@/features/question/components/aside";
import { RelatedTopics } from "@/features/topic/components/related-topic";
import { Questions } from "@/features/question/components/questions";

export const QuestionRoute = () => {
  return (
    <MainLayout LeftSidebar={Aside} RightSidebar={RelatedTopics}>
      <section className="md:ml-[16rem] lg:mr-[22rem]">
        <Questions />
      </section>
    </MainLayout>
  );
};
