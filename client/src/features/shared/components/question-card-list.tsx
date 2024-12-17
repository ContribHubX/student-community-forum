import { Question } from "@/types";

import { QuestionCard } from "./question-card";
import { useAuth } from "@/hooks/use-auth";

import { FaStar } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";

interface QuestionCardListProp {
  questions: Question[];
}

export const QuestionCardList = ({ questions }: QuestionCardListProp) => {
  const { authState } = useAuth();

  return (
    <div>
      <div className="text-primary-foreground flex items-center gap-4 bg-primary rounded-md p-3 my-4 shadow-md">
        <div className="rounded-md h-[30px] w-[30px] flex items-center justify-center bg-accent">
          <FaStar className="text-lg text-accent-foreground" />
        </div>
        <p className="text-sm font-medium">Questions for you</p>
        <FaRegPenToSquare className="ml-auto text-lg" />
      </div>

      <div className="flex flex-col gap-4  rounded-md">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            currentUserId={authState?.user?.id || ""}
          />
        ))}
      </div>
    </div>
  );
};
