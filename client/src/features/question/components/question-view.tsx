import { QuestionViewCard } from "./question-view-card";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useGetQuestion } from "../api/get-question";
import { User } from "@/types";

interface QuestionViewProp {
  user: User;
}

export const QuestionView = ({ user }: QuestionViewProp) => {
  const { questionId } = useParams();
  const { data: question } = useGetQuestion({ questionId: questionId || "" });

  // temp
  if (!question) return <p>Loading...</p>;

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

        <div></div>
      </div>

      <div></div>
    </div>
  );
};
