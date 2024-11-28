import { useNavigate } from "react-router-dom";

import { Question } from "@/types";

import { FaArrowUp } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { statusColors } from "@/features/workspace/constant";
import { useTheme } from "@/hooks/use-theme";
import { useGetVotes } from "@/features/question/api/get-votes";
import { useCreateVote } from "@/features/question/api/vote";

interface QuestionCardProp {
  currentUserId: string;
  question: Question;
}
 
export const QuestionCard = ({ question, currentUserId }: QuestionCardProp) => {
  const navigate = useNavigate();
  const { data: votes } = useGetVotes({ data: {userId: currentUserId.toString(), questionId: question.id} });
  const { mutate: createVote } = useCreateVote({});
  const { isDark } = useTheme();

  const handleCreateVote = (vote: "up" | "down") => {
    createVote({
      userId: currentUserId, 
      questionId: question.id,
      vote
    })
  }

  return (
    <div  
      className="shadow-md text-primary-foreground rounded-md p-6 bg-primary"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div className="cursor-pointer">
              <Avatar className="p-[3px] bg-accent">
                <AvatarImage
                  src={question.createdBy.attachment}
                  className="rounded-full "
                />
              </Avatar>
            </div>
          <div className="flex  flex-col gap-0">
            <small className="text-xs text-muted-foreground">Asked on March 12, 2024</small>
            <h1 className="font-semibold">{question.title}</h1>
          </div>
        </div>

        <div 
          className="bg-accent px-2 py-1 text-xs rounded-md"
          style={{
            color: statusColors["active"].text,
            backgroundColor: !isDark ? statusColors["active"].background : "#1e252b"
          }}
        >
          QUESTION
        </div>
      </div>

      <div className="flex gap-8 mt-4">
        <div className="flex items-center gap-1 flex-col ml-2">
          <FaArrowUp 
            onClick={() => handleCreateVote("up")}
            className={`text-base cursor-pointer text-muted-foreground hover:text-green-400 ${
              votes?.userVote === "up" ? "text-green-400" : ""
            }`}
          />
          <p>{votes?.upvoteCount || 0}</p>
          <FaArrowUp 
            onClick={() => handleCreateVote("down")}
            className={`rotate-180 text-base cursor-pointer hover:text-red-400 text-muted-foreground ${
              votes?.userVote === "down" ? "text-red-400" : ""
            }`}
          />
        </div>

        <p className="text-sm text-muted-foreground">{question.content}</p>
      </div>

      <div className="flex items-center justify-between text-muted-foreground  bg-background p-4 ml-[57px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 bg-primary py-2 text-xs border dark:border-none">
            <FaMessage />
            <span>{question?.threads?.length || 0}</span>
            <span>answers</span>
          </div>
          <div className="flex items-center gap-1 px-3 bg-primary py-2 text-xs border dark:border-none">
            <FaEye className="text-sm"/>
            <span>10</span>
            <span>views</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/question/${question.id}`)}
          className="text-accent-foreground text-xs py-2 px-3 rounded-md bg-accent"
        >
          Answer
        </button>
      </div>
    </div>
  );
};
