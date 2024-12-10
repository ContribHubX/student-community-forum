import { QuestionCardList } from "@/features/shared/components/question-card-list";
import { useGetQuestions } from "../../shared/api/get-all-question";
import { NewPostIndicator } from "@/components/ui/new-post-indicator";
import { useNewPostIndicator } from "@/hooks/use-post-indicator";
import { useSocketProvider } from "@/hooks/use-socket-provider";
import { useEffect, useRef } from "react";

export const Questions = () => {
  const { data: questions } = useGetQuestions({});

  const questionsRef = useRef<HTMLDivElement>(null)
  const { isVisible, showIndicator, handleIndicatorClick } = useNewPostIndicator({ elementRef: questionsRef });
  const { socketState } = useSocketProvider();

  useEffect(() => {
    if (!socketState || !socketState.globalEvent || socketState.globalEvent?.type !== "question") return;
      showIndicator()
  }, [socketState.globalEvent])

  // temp
  if (!questions) return <p>Loading...</p>;

  return (
    <div>
      <div
        ref={questionsRef}
      >
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
