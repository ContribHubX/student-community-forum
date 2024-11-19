import { QuestionCard } from "./question-card"
import { sampleQuestions } from "../data/questions"
import { FaStar } from "react-icons/fa";

export const QuestionCardList = () => {
  return (
    <div>
        <div className="text-primary-foreground flex items-center gap-4 bg-primary rounded-md p-3 my-4">
            <div className="rounded-md h-[30px] w-[30px] flex items-center justify-center bg-accent">
                <FaStar className="text-lg text-accent-foreground" />
            </div>
            <p className="text-sm font-medium">Questions for you</p>
        </div>

        <div className="flex flex-col bg-primary rounded-md p-3">
            {sampleQuestions.map(question => (
                <QuestionCard
                    key={question.id}
                    question={question}
                />
            ))}
        </div>
    </div>
  )
}
