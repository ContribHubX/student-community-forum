import { MainLayout } from "@/components/layouts/layout";
import { Aside } from "@/features/question/components/aside";
import { Questions } from "@/features/question/components/questions";

export const QuestionViewRoute = () => {
  return (
    <MainLayout LeftSidebar={Aside}>
      <section className="md:ml-[16rem] lg:mr-[22rem]">
        <div>
          <Questions /> 
        </div>
      </section>
    </MainLayout>
  )
};
