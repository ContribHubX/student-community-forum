import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { CreateThreadForm } from "../../shared/components/create-thread-form";
import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useCreateThread } from "../../shared/api/create-thread";

interface ThreadsProp {
  userId: string;
}

export const Threads = ({ userId }: ThreadsProp) => {
  const { authState } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: createThread } = useCreateThread({});

  const handleCreateThread = (data: FormData) => {
    createThread(data);
  } 

  const handleThreadFormModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div>
      <div className="flex p-6 gap-6 rounded-xl bg-primary relative mb-6 shadow-slate-400 shadow-md dark:shadow-gray-900">
        <div className="w-full flex gap-4 items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={authState.user?.attachment}
              className="rounded-full "
            />
          </Avatar>
          <input
            readOnly
            className="h-full text-sm w-full font-light px-5 bg-background text-primary-foreground rounded-md
            outline-none focus:border-red-600"
            placeholder="Lets share what's going on your mind.."
            onFocus={handleThreadFormModal}
          />
        </div>
        <button
          onClick={handleThreadFormModal}
          type="submit"
          className="shrink-0 w-40 bg-accent text-accent-foreground p-3 text-sm rounded-md "
        >
          Create Thread
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleThreadFormModal}
        className="p-5 w-[1000px] max-h-[600px]"
      >
        <CreateThreadForm 
          userId={userId}
          handleFormSubmit={handleCreateThread}
        />
      </Modal>

      <div>
        <ThreadCardList />
      </div>
    </div>
  );
};
