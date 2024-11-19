import { Question } from "@/types"
import { Button } from "@/components/ui/button"
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineRssFeed } from "react-icons/md";

interface QuestionCardProp {
    question: Question
}

export const QuestionCard = ({ question }: QuestionCardProp) => {
  return (
    <div className="text-primary-foreground p-3 text-sm">
        <h2 className="font-medium text-base">{question.title}</h2>

        <div className="mt-4">
            <div>
                <p className="text-sm dark:text-muted-foreground">12 answers</p>
                {/* <p>Last followed </p> */}
            </div>

            <div className="flex items-center gap-4 mt-2">
                <Button className="text-accent-foreground text-sm">
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
  )
}
