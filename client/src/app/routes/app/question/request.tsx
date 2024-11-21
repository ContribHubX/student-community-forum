import { MainLayout } from "@/components/layouts/layout"
import { Aside } from "@/features/question/components/aside"
import { RelatedTopics } from "@/features/topic/components/related-topic"
import { useAuth } from "@/hooks/use-auth"
import { QuestionRequestCardList } from "@/features/question/components/question-request-card-list"

export const RequestRoute = () => {
  const { authState } = useAuth();
 
  return (
    <MainLayout LeftSidebar={Aside} RightSidebar={RelatedTopics}>
      <section className="md:ml-[16rem] lg:mr-[22rem]">
        <QuestionRequestCardList 
          user={authState.user}
        /> 
      </section>
  </MainLayout>
  )
}
