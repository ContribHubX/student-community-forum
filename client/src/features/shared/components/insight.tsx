import { HelpCircle } from 'lucide-react'
import { CreateQuestionForm } from "./create-question-form"
import { SidebarLayout } from "@/components/layouts/sidebar-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { CreateQuestionType, useCreateQuestion } from "../api/create-question"
import { useAuth } from "@/hooks/use-auth"
import { formDataToObject } from "@/utils"
import askIllustration from "@/assets/question/ask-1.svg"

export const Insight = () => {
  const { authState } = useAuth()
  const { mutate: createQuestion } = useCreateQuestion({})

  const handleCreateQuestion = (data: FormData) => {
    createQuestion(formDataToObject(data) as CreateQuestionType)
  }

  return (
    <SidebarLayout
      className="hidden lg:flex"
      width={325}
      height="full"
      position="right-6"
    >
      <Card className="w-full h-[350px] overflow-hidden bg-primary dark:border-none">
        <CardContent className="p-6 flex flex-col items-center justify-between h-full">
          <div className="flex flex-col items-center text-center space-y-0">
            <div className="relative w-[150px] h-[150px]">
              <img
                src={askIllustration}
                alt="Ask a question illustration"
                // layout="fill"
                // objectFit="contain"
              />
            </div>
            <h3 className="text-lg font-semibold">Got a Question?</h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Frame insightful questions to deepen your understanding of this topic.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full text-accent-foreground" size="lg">
                <HelpCircle className="mr-2 h-4 w-4" />
                Ask Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] lg:max-w-[800px]">
              <CreateQuestionForm
                initialTopic={undefined}
                userId={authState.user?.id || ""}
                handleFormSubmit={handleCreateQuestion}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </SidebarLayout>
  )
}

