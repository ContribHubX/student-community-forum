import { QuestionCardList } from "@/features/shared/components/question-card-list";
import { useGetQuestions } from "../../shared/api/get-all-question";

export const Questions = () => {
  const { data: questions } = useGetQuestions({});
  
  // temp
  if (!questions) return <p>Loading...</p>;

  return (
    <div>
      <QuestionCardList questions={questions} />
    </div>
  );
};
