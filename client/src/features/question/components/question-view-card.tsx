import { FaPencilAlt } from "react-icons/fa";
import { Question, User } from "@/types";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { SelectRequest } from "./select-request";
import { useCreateThread } from "@/features/shared/api/create-thread";
import { MessageSquare, Eye, ChevronUp } from "lucide-react";
import { CreateQuestionForm } from "@/features/shared/components/create-question-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface QuestionViewCardProp {
  currentUser: User;
  question: Question;
}

export const QuestionViewCard = ({
  currentUser,
  question,
}: QuestionViewCardProp) => {
  return (
    <div className="w-full bg-primary rounded-xl p-8 shadow-lg dark:shadow-gray-900 text-primary-foreground transition-all duration-300 hover:shadow-xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{question.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">
                {question.threads?.length || 0} answers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm">10 views</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full hover:accent text-primary-foreground`}
              onClick={() => ""}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p
            className="text-sm text-muted-foreground mb-4"
            dangerouslySetInnerHTML={{ __html: question.content }}
          ></p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t dark:border-muted-foreground border-primary-foreground/10">
          <Dialog>
            <DialogTrigger>
              <div>
                <Button
                  variant="outline"
                  className="text-sm hover:bg-primary-foreground hover:text-primary transition-colors duration-200"
                >
                  Request Answer
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="p-5 w-[500px] max-h-[600px]">
              <div className="mt-6">
                <SelectRequest
                  questionId={question.id}
                  currentUserId={currentUser.id}
                />
              </div>
            </DialogContent>
          </Dialog>
          <div>
            <AnswerPrompt question={question} user={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface AnswerPromptProps {
  user: User | undefined;
  question: Question;
}

const AnswerPrompt = ({ user, question }: AnswerPromptProps) => {
  const { mutate: createThread } = useCreateThread({
    mutationConfig: {
      onSuccess: () => {
        console.log("hello");
      },
    },
  });

  const handleCreateThread = (data: FormData) => {
    data.append("questionId", question.id);
    createThread(data);

    console.log("helllo");
  };
  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex items-center space-x-4 cursor-pointer group">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user.attachment} />
      </Avatar>
      <div>
        <p className="font-medium group-hover:text-accent transition-colors duration-200">
          {user.name}, can you answer this?
        </p>
        <p className="text-sm text-muted-foreground">Share your knowledge</p>
      </div>

      <Dialog>
        <DialogTrigger>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
            size="sm"
          >
            <FaPencilAlt className="mr-2" />
            Answer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] bg-primary">
          <CreateQuestionForm
            initialTopic={question.topic}
            initialTitleVal={question.title}
            userId={user.id}
            handleFormSubmit={handleCreateThread}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
