import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { Question, User } from "@/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SelectRequest } from "./select-request";
import { useCreateThread } from "@/features/shared/api/create-thread";
import { ThreadForm } from "@/features/shared/components/create-thread-form";
import { useDisclosure } from "@/hooks/use-disclosure";
import { MessageSquare, Eye, ThumbsUp, ChevronUp } from 'lucide-react';

interface QuestionViewCardProp {
  currentUser: User;
  question: Question;
}

export const QuestionViewCard = ({
  currentUser,
  question,
}: QuestionViewCardProp) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    isOpen: isReqModalOpen,
    toggle: toggleReqModal,
    close: closeReqModal,
  } = useDisclosure();

  const { mutate: createThread } = useCreateThread({});

  const handleCreateThread = (data: FormData) => {
    data.append("questionId", question.id);
    createThread(data);
  };

  const handleThreadFormModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-full bg-primary rounded-xl p-8 shadow-lg dark:shadow-gray-900 text-primary-foreground transition-all duration-300 hover:shadow-xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{question.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">{question.threads?.length || 0} answers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm">10 views</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full hover:accent text-primary-foreground`}
              onClick={() => ''}
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
          <Button
            onClick={toggleReqModal}
            variant="outline"
            className="text-sm hover:bg-primary-foreground hover:text-primary transition-colors duration-200"
          >
            Request Answer
          </Button>
          <AnswerPrompt
            onHandleClick={handleThreadFormModal}
            user={currentUser}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleThreadFormModal}
        className="p-5 w-[1000px] max-h-[600px]"
      >
        <ThreadForm
          initialTitleVal={question.title}
          user={currentUser}
          handleFormSubmit={handleCreateThread}
        />
      </Modal>

      <Modal
        isOpen={isReqModalOpen}
        onClose={closeReqModal}
        className="p-5 w-[500px] max-h-[600px]"
      >
        <SelectRequest
          questionId={question.id}
          currentUserId={currentUser.id}
        />
      </Modal>
    </div>
  );
};

interface AnswerPromptProps {
  user: User | undefined;
  onHandleClick: () => void;
}

const AnswerPrompt = ({ user, onHandleClick }: AnswerPromptProps) => {
  if (!user) return <p>Loading...</p>;

  return (
    <div
      onClick={onHandleClick}
      className="flex items-center space-x-4 cursor-pointer group"
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={user.attachment} />
      </Avatar>
      <div>
        <p className="font-medium group-hover:text-accent transition-colors duration-200">
          {user.name}, can you answer this?
        </p>
        <p className="text-sm text-muted-foreground">
          Share your knowledge
        </p>
      </div>
      <Button
        className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
        size="sm"
      >
        <FaPencilAlt className="mr-2" />
        Answer
      </Button>
    </div>
  );
};

