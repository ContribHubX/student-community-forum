import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { Question, User } from "@/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SelectRequest } from "./select-request";
import { useCreateThread } from "@/features/shared/api/create-thread";
import { MessageSquare, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { CreateQuestionForm } from "@/features/shared/components/create-question-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { getQuestionQueryOptions } from "../api/get-question";
import { toast } from "react-toastify";

interface QuestionViewCardProp {
  currentUser: User;
  question: Question;
}

export const QuestionViewCard = ({
  currentUser,
  question,
}: QuestionViewCardProp) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/90 dark:bg-primary backdrop-blur-lg rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {question.title}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">{question.threads?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Eye className="w-5 h-5" />
              <span className="text-sm">10</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : "100px" }}
          className="prose dark:prose-invert max-w-none overflow-hidden"
        >
          <p
            className="text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: question.content }}
          ></p>
        </motion.div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
          <Dialog>
            <DialogTrigger>
              <Button
                variant="outline"
                className="text-sm hover:bg-accent dark:text-accent-foreground hover:text-white transition-colors duration-200"
              >
                Request Answer
              </Button>
            </DialogTrigger>
            
            <DialogContent className="p-5 w-[500px] max-h-[600px] dark:border-none bg-primary">
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
    </motion.div>
  );
};

interface AnswerPromptProps {
  user: User;
  question: Question;
}

const AnswerPrompt = ({ user, question }: AnswerPromptProps) => {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createThread } = useCreateThread({
    mutationConfig: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: getQuestionQueryOptions(data.questionId || "").queryKey,
        });
      },
    },
  });

  const handleCreateThread = (data: FormData) => {
    data.append("questionId", question.id);
    createThread(data);
    toast.success("Answer submitted!");
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-4 group">
      <Avatar className="w-10 h-10 ring-2 ring-blue-500 ring-offset-2">
        <AvatarImage src={user.attachment} />
      </Avatar>
      <div>
        <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors duration-200">
          {user.name}, can you answer this?
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Share your knowledge
        </p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger onClick={() => setIsOpen(true)}>
          <Button
            className="bg-accent text-white transition-colors duration-200"
            size="sm"
          >
            <FaPencilAlt className="mr-2" />
            Answer
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] bg-primary dark:border-gray-600 lg:max-w-[800px]">
          <CreateQuestionForm
            initialTopic={question.topic}
            initialTitleVal={question.title}
            userId={user.id}
            handleFormSubmit={handleCreateThread}
            taggable
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
