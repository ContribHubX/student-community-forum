import { Button } from "@/components/ui/button"
import { Question, User } from "@/types"
import { FaPencilAlt } from "react-icons/fa"
import { MdOutlineRssFeed } from "react-icons/md"
import { RxCross2 } from "react-icons/rx"
import { useNavigate } from "react-router-dom"
import { useGetUsersByQuestion } from "../api/get-users-by-question"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface QuestionRequestCardProp {
    question: Question
    requestedBy: User
} 

export const QuestionRequestCard = ({ question, requestedBy }: QuestionRequestCardProp) => {
    const { data: users } = useGetUsersByQuestion({ questionId: question.id || "" });
    const navigate = useNavigate();

  return (
    <div 
    onClick={() => navigate(`/question/${question.id}`)}
    className="text-primary-foreground px-4 py-3 text-sm flex items-start justify-between hover:bg-background rounded-lg"
    >   
        <div className="flex gap-3 flex-col">
            <div className="flex items-center gap-3">
                <Avatar
                    className="w-[30px] h-[30px]"
                >
                    <AvatarImage
                        src={requestedBy.attachment}
                    />
                </Avatar>
                <p className="text-xs text-muted-foreground">{requestedBy.name} requested your answer to this question</p>
            </div>
            <div>
            <div>
                <h2 className="font-medium text-base">{question.title}</h2>
                <p className="text-xs mt-3 ">{question.content}</p>
            </div>
        </div>
        <div className="mt-4">
            <div>
            {/* <p className="text-sm dark:text-muted-foreground">12 answers</p> */}
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

        <div className="flex flex-col justify-between h-[155px]">
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
  )
}
