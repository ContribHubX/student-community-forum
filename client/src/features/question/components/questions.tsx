import { QuestionCardList } from "@/features/shared/components/question-card-list";
import { useGetQuestions } from "../../shared/api/get-all-question";
import { NewPostIndicator } from "@/components/ui/new-post-indicator";
import { useNewPostIndicator } from "@/hooks/use-post-indicator";
import { useSocketProvider } from "@/hooks/use-socket-provider";
import { useEffect, useRef } from "react";
import { MyLoader } from "@/components/shared/loader";

export const Questions = () => {
  const { data: questions, isFetching } = useGetQuestions({});

  const questionsRef = useRef<HTMLDivElement>(null);
  const { isVisible, showIndicator, handleIndicatorClick } =
    useNewPostIndicator({ elementRef: questionsRef });
  const { socketState } = useSocketProvider();
  
  console.log(questions);

  useEffect(() => {
    if (
      !socketState ||
      !socketState.globalEvent ||
      socketState.globalEvent?.type !== "question"
    )
      return;
    showIndicator();
  }, [socketState.globalEvent]);

  if (!questions || isFetching) {
    return <MyLoader />;
  }

  return (
    <div className="-mt-4">
      <div ref={questionsRef}>
        <QuestionCardList questions={questions} />
      </div>
      <NewPostIndicator
        type="question"
        showIndicator={isVisible}
        handleIndicatorClick={handleIndicatorClick}
      />
    </div>
  );
};
