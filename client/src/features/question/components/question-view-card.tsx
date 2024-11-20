import request from "@/assets/question/request.svg";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";
import { FaPencilAlt } from "react-icons/fa";

export const QuestionViewCard = () => {
  const { authState } = useAuth();

  return (
    <div className="w-full bg-primary rounded-xl p-5
     shadow-slate-400 shadow-md dark:shadow-gray-900 text-primary-foreground">
        {/* render quill */}
        <div>
            <h1 className="text-xl font-semibold">Can you recommend any great war movies that do not include romance?</h1>
        </div>

        <div className="mt-4 w-fit group h-[30px]" >
            <div className="flex items-center gap-3 cursor-pointer" >
                <img src={request} alt="request" />
                <p className="text-sm self-end">Request</p>
            </div>
            <div className="h-[2px] w-[17px] bg-accent mt-1 hidden group-hover:block"/>
        </div>
        
        <div className="mt-1 cursor-default">
            <AnswerPrompt 
                user={authState.user}
            />
        </div>
    </div>
  )
}

interface AnswerPrompt {
    user: User | undefined
}

const AnswerPrompt = ({ user }: AnswerPrompt) => {
    
    if (!user) return <p>Loading...</p>

    return (
        <div className="bg-background flex flex-col items-center justify-center gap-3 py-9">
            <Avatar
                className="w-[50px] h-[50px]"
            >
                <AvatarImage 
                    src={user.attachment}
                />
            </Avatar>
            <div>
                <p>{user.name}, can you answer this question?</p>
                <p className="text-muted-foreground text-sm">People are searching for a better answer to this question</p>
            </div>
            <Button className="text-accent-foreground text-sm py-1 px-4">
              <FaPencilAlt />
              <span>Answer</span>
            </Button>
        </div>
    )
}