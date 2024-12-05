import { useParams } from "react-router-dom";

import { QuestionViewCard } from "./question-view-card";
import { useGetQuestion } from "../api/get-question";
import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { useGetQuestionAnswers } from "../api/get-question-answers";

import { User } from "@/types";

import { FaEnvelopeOpenText } from "react-icons/fa6";


interface QuestionViewProp {
  user: User;
}

export const QuestionView = ({ user }: QuestionViewProp) => {
  const { questionId } = useParams();
  const { data: question } = useGetQuestion({ questionId: questionId || "" });
  const { data: answers } = useGetQuestionAnswers({ questionId: questionId || "" });

  // temp
  if (!question || !answers) return <p>Loading...</p>;

  console.log(answers)

  return (
    <div>
      <div>
        <QuestionViewCard currentUser={user} question={question} />
      </div>

      <div className="my-6">
        <div className="flex items-center gap-3">
          <FaEnvelopeOpenText className="text-xl text-muted-foreground" />
          <p className="text-primary-foreground">100 Answers</p>
        </div>

        <div className="mt-6">
          <ThreadCardList 
            threads={answers}
          />
        </div>
      </div>

      <div></div>
    </div>
  );
};
