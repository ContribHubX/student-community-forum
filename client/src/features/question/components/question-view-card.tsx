import { useState } from "react";
import request from "@/assets/question/request.svg";
import { FaPencilAlt } from "react-icons/fa";
import { Question, User } from "@/types";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SelectRequest } from "./select-request";

import { useCreateThread } from "@/features/shared/api/create-thread";
import { CreateThreadForm } from "@/features/shared/components/create-thread-form";

import { useDisclosure } from "@/hooks/use-disclosure";

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
    // append question id
    data.append("questionId", question.id);
    createThread(data);
  };

  const handleThreadFormModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div
      className="w-full bg-primary rounded-xl p-5
     shadow-slate-400 shadow-md dark:shadow-gray-900 text-primary-foreground"
    >
      {/* render quill */}
      <div>
        <h1 className="text-xl font-semibold">{question.title}</h1>

        {/* temporary */}
        <p className="text-sm mt-4">{question.content}</p>
      </div>

      <div onClick={toggleReqModal} className="mt-4 w-fit group h-[30px]">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={request} alt="request" />
          <p className="text-sm self-end">Request</p>
        </div>
        <div className="h-[2px] w-[17px] bg-accent mt-1 hidden group-hover:block" />
      </div>

      <div className="mt-1 cursor-default">
        <AnswerPrompt
          onHandleClick={handleThreadFormModal}
          user={currentUser}
        />
      </div>

      <div>
        <Modal
          isOpen={isModalOpen}
          onClose={handleThreadFormModal}
          className="p-5 w-[1000px] max-h-[600px]"
        >
          <CreateThreadForm
            initialTitleVal={question.title}
            userId={currentUser.id}
            handleFormSubmit={handleCreateThread}
          />
        </Modal>
      </div>

      <div>
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
    </div>
  );
};

interface AnswerPrompt {
  user: User | undefined;
  onHandleClick: () => void;
}

const AnswerPrompt = ({ user, onHandleClick }: AnswerPrompt) => {
  if (!user) return <p>Loading...</p>;

  return (
    <div
      onClick={onHandleClick}
      className="bg-background flex flex-col items-center justify-center gap-3 py-9"
    >
      <Avatar className="w-[50px] h-[50px]">
        <AvatarImage src={user.attachment} />
      </Avatar>
      <div>
        <p>{user.name}, can you answer this question?</p>
        <p className="text-muted-foreground text-sm">
          People are searching for a better answer to this question
        </p>
      </div>
      <Button className="text-accent-foreground text-sm py-1 px-4">
        <FaPencilAlt />
        <span>Answer</span>
      </Button>
    </div>
  );
};
