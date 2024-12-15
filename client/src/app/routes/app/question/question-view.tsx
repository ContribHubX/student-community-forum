import { MainLayout } from "@/components/layouts/layout";
import { Aside } from "@/features/question/components/aside";
import { QuestionView } from "@/features/question/components/question-view";
import { useAuth } from "@/hooks/use-auth";

export const QuestionViewRoute = () => {
  const { authState } = useAuth();

  if (!authState?.user?.id) return <p>Loading...</p>;

  return (
    <MainLayout LeftSidebar={Aside}>
      <section
        className=""
      >
        <div>
          <QuestionView user={authState.user} />
        </div>
      </section>
    </MainLayout>
  );
};
