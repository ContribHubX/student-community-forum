import { MainLayout } from "@/components/layouts/layout";

import { Aside } from "@/features/question/components/aside";
import { Insight } from "@/features/shared/components/insight";
import { Questions } from "@/features/question/components/questions";

export const QuestionRoute = () => {
  return (
    <MainLayout LeftSidebar={Aside} RightSidebar={Insight}>
      <section className="">
        <Questions />
      </section>
    </MainLayout>
  );
};
