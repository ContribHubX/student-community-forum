import { useState } from "react";
import { Topic } from "@/types";

import { MdOutlineRssFeed } from "react-icons/md";
import { BsVectorPen } from "react-icons/bs";

import { CreateThreadForm } from "@/features/shared/components/create-thread-form";
import { CreateQuestionType } from "@/features/shared/api/create-question";

import { Modal } from "@/components/ui/modal";
import { useGetTopicFollowers } from "../api/get-followers";

import { useDisclosure } from "@/hooks/use-disclosure";
import { formDataToObject } from "@/utils";

interface TopicCardProp {
  userId: string;
  topic: Topic;
  createQuestion: (data: CreateQuestionType) => void;
  createThread: (data: FormData) => void;
}

export const TopicCard = ({
  userId,
  topic,
  createQuestion,
  createThread,
}: TopicCardProp) => {
  const { data: followers } = useGetTopicFollowers({ topicId: topic.id });
  const {
    isOpen: isModalOpen,
    toggle: toggleModal,
    close: closeModal,
  } = useDisclosure();
  const [postType, setPostType] = useState("thread");

  const handleSubmit = (data: FormData) => {
    data.append("topicId", topic.id || "");

    if (postType === "thread") createThread(data);
    else createQuestion(formDataToObject(data) as CreateQuestionType);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPostType(event.target.value);
  };

  return (
    <div className="p-4 bg-primary rounded-md flex  gap-5">
      <img
        src={topic.attachment}
        alt="image"
        className="max-w-[120px] min-h-[100px]  object-cover rounded-md "
      />

      <div className="text-primary-foreground flex flex-col justify-between">
        <div>
          <h1 className="font-semibold text-xl">{topic.name}</h1>
          <div className="flex items-center gap-4 ml-1 mt-1">
            <div className="w-[8px] h-[8px] rounded-full bg-[#00FF00]" />
            <p className="text-xs text-muted-foreground">Learn and education</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground  ">
          <div
            className="group bg-background w-fit p-2 rounded-md hover:scale-125 transition-transform cursor-pointer hover:bg-accent"
            onClick={toggleModal}
          >
            <BsVectorPen className="text-lg group-hover:text-white" />
          </div>
          <div className="flex items-center gap-2 bg-background w-fit p-2 rounded-md ">
            <MdOutlineRssFeed className="text-xl" />
            <span className="text-xs">{followers?.length || 0} Followers</span>
          </div>
        </div>
      </div>

      <div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          className="p-5 w-[1000px] max-h-[600px]"
        >
          <div>
            <label>Choose post type:</label>
            <select
              onChange={handleSelectChange}
              className="border p-2 rounded"
            >
              <option value="thread">Thread</option>
              <option value="question">Question</option>
            </select>
          </div>
          <CreateThreadForm userId={userId} handleFormSubmit={handleSubmit} />
        </Modal>
      </div>
    </div>
  );
};
