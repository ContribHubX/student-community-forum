import { QuestionAnswerCard } from "./question-answer-card";
import { useAuth } from "@/hooks/use-auth";
import { Thread } from "@/types";

interface QuestionAnswerListProp {
  threads: Thread[];
}

export const QuestionAnswerList = ({ threads }: QuestionAnswerListProp) => {
  const { authState } = useAuth();

  // Temporary only
  if (!threads || !authState.user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {threads.map((thread) => (
        <QuestionAnswerCard
          key={thread.id}
          thread={thread}
          userId={authState?.user?.id || ""}
        />
      ))}
    </div>
  );
};
