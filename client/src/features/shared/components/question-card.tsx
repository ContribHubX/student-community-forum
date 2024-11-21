import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineRssFeed } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useGetUsersByQuestion } from "@/features/question/api/get-users-by-question";

interface QuestionCardProp {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProp) => {
  const navigate = useNavigate();
  const { data: users } = useGetUsersByQuestion({ questionId: question.id || "" });

  return (
    <div 
      onClick={() => navigate(`/question/${question.id}`)}
      className="text-primary-foreground px-4 py-3 text-sm flex items-start justify-between hover:bg-background rounded-lg"
      >
      <div>
        <h2 className="font-medium text-base">{question.title}</h2>
        <div className="mt-4">
          <div>
            <p className="text-sm dark:text-muted-foreground">12 answers</p>
            {/* <p>Last followed </p> */}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Button className="text-accent-foreground text-sm py-1 px-3">
              <FaPencilAlt />
              <span>Answer</span>
            </Button>
            <div className="flex items-center gap-2">
              <MdOutlineRssFeed className="text-2xl dark:text-muted-foreground" />
              <p>Follow: 1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between h-[100px]">
        <RxCross2 className="text-lg font-semibold self-end" />
        <div className="flex items-center">
          {users?.map((user) => (
            <Avatar 
              key={user.id} 
                className="ml-[-15px] object-cover h-[40px] w-[40px]"
              >
              <AvatarImage
                src={user.attachment}
                className="rounded-full "
              />
            </Avatar>
          ))}
          <div className="ml-2 text-muted-foreground text-xs"> + 2 answers</div>
        </div>
      </div>
    </div>
  );
};
