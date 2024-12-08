import { useParams } from "react-router-dom";
import { QuestionViewCard } from "./question-view-card";
import { useGetQuestion } from "../api/get-question";
import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { useGetQuestionAnswers } from "../api/get-question-answers";
import { User } from "@/types";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { MessageCircle } from 'lucide-react';


interface QuestionViewProp {
  user: User;
}

export const QuestionView = ({ user }: QuestionViewProp) => {
  const { questionId } = useParams();
  const { data: question } = useGetQuestion({ questionId: questionId || "" });
  const { data: answers } = useGetQuestionAnswers({
    questionId: questionId || "",
  });

  if (!question || !answers) return <p>Loading...</p>;

  return (
    <div className="min-h-screen"  >
      <div className="max-w-4xl mx-auto space-y-8">
        <QuestionViewCard currentUser={user} question={question} />
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="text-2xl text-accent" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {answers.length} Answers
          </h2>
        </div>

        <div className="space-y-4">
          <ThreadCardList threads={answers} />
        </div>
      </div>
    </div>
  );
};

