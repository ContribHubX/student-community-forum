import { MainLayout } from "@/components/layouts/layout";
import { Aside } from "@/features/question/components/aside";
import { RelatedTopics } from "@/features/topic/components/related-topic";
import { QuestionCardList } from "@/features/shared/components/question-card-list";
import { sampleQuestions } from "@/features/shared/data/questions";

export const QuestionRoute = () => {
  return (
    <MainLayout
        LeftSidebar={Aside}
        RightSidebar={RelatedTopics}
    >
        <section className="md:ml-[16rem] lg:mr-[22rem]">
            <QuestionCardList
                questions={sampleQuestions}
            />
        </section>
    </MainLayout>
  )
}
