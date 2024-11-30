import { MainLayout } from "@/components/layouts/layout";

import { Aside } from "@/features/question/components/aside";
import { Insight } from "@/features/shared/components/insight";
import { Questions } from "@/features/question/components/questions";

export const QuestionRoute = () => {
  return (
    <MainLayout LeftSidebar={Aside} RightSidebar={Insight}>
      <section className="md:ml-[16rem] lg:mr-[22rem]">
        <Questions />
      </section>
    </MainLayout>
  );
};
