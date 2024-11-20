import { QuestionViewCard } from "./question-view-card"
import { FaEnvelopeOpenText } from "react-icons/fa6";


export const Questions = () => {
  return (
    <div>
        <div>
            <QuestionViewCard />
        </div>
        
        <div className="my-6">
            <div className="flex items-center gap-3">
                <FaEnvelopeOpenText className="text-xl text-muted-foreground" />
                <p className="text-primary-foreground">100 Answers</p>
            </div>

            <div>

            </div>
        </div>

        <div>
           
        </div>
    </div>
  )
}
