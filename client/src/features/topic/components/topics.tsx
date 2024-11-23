import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuestionCardList } from "@/features/shared/components/question-card-list";
import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { sampleQuestions } from "@/features/shared/data/questions";
import { CreateThreadForm } from "@/features/shared/components/create-thread-form";
import { useCreateQuestion } from "@/features/shared/api/create-question";

import { Modal } from "@/components/ui/modal";
import { useDisclosure } from "@/hooks/use-disclosure";
import { TopicCard } from "./topic-card";
import { useGetTopic } from "../api/get-topic";
import { formDataToObject } from "@/utils";
import { CreateQuestionType } from "@/features/shared/api/create-question";

import ask from "@/assets/question/ask-1.svg";
import { PiSealQuestionBold } from "react-icons/pi";
import { useGetQuestions } from "@/features/shared/api/get-all-question";
import { useGetThreadsByTopic } from "../api/get-threads-by-topic";
import { useCreateThread } from "@/features/shared/api/create-thread";

interface TopicsProp {
  userId: string;
}

type ActiveTabType = "Read" | "Answer";

export const Topics = ({ userId }: TopicsProp) => {
  const { topicId } = useParams();
  const [activeTab, setActiveTab] = useState<ActiveTabType>("Answer");
  const {
    isOpen: isModalOpen,
    toggle: toggleModal,
    close: closeModal,
  } = useDisclosure();
  const { mutate: createQuestion } = useCreateQuestion({});
  const { mutate: createThread } = useCreateThread({});
  const {
    data: questions,
    isLoading: questionsLoading,
    refetch,
  } = useGetQuestions({ topicId: topicId || "" });
  const { data: topic } = useGetTopic({ topicId: topicId || "" });
  const { data: threads } = useGetThreadsByTopic({ topicId: topicId || "" });

  const handleCreateQuestion = (data: FormData) => {
    data.append("topicId", topicId || "");
    createQuestion(formDataToObject(data) as CreateQuestionType);
  };

  const toggleCreateModal = () => {
    toggleModal();
  };

  const toggleActiveTab = () => {
    setActiveTab(activeTab === "Answer" ? "Read" : "Answer");
  };

  useEffect(() => {
    if (topicId && topicId !== "") {
      refetch();
    }
  }, [refetch, topicId]);

  // temp
  if (!topic || questionsLoading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <TopicCard 
          userId={userId} 
          topic={topic} 
          createThread={createThread}
          createQuestion={createQuestion}
        />
      </div>

      <div className="flex gap-5 border-b-[1px] dark:border-b-[#262D34] text-primary-foreground text-sm pt-3 mt-4">
        <TabItem
          name="Read"
          onClick={toggleActiveTab}
          isActive={activeTab === "Read"}
        />
        <TabItem
          name="Answer"
          onClick={toggleActiveTab}
          isActive={activeTab === "Answer"}
        />
      </div>

      <div className="mt-4 h-full">
        {activeTab === "Answer" ? (
          questions && questions.length > 0 ? (
            <QuestionCardList questions={sampleQuestions} />
          ) : (
            <div className="bg-primary rounded-md flex flex-col gap-5 items-center justify-center h-[400px]">
              <img src={ask} alt="illustration" className="w-[200px] mx-auto" />
              <p className="text-muted-foreground text-sm text-center max-w-[300px]">
                Frame insightful questions based on this topic to deepen
                understanding.
              </p>
              <button
                className="text-accent-foreground text-xl rounded-full bg-accent flex items-center justify-center py-3 px-4 gap-2"
                onClick={toggleCreateModal}
              >
                <PiSealQuestionBold />
                <span className="text-sm">Ask Now</span>
              </button>
            </div>
          )
        ) : (
          <ThreadCardList threads={threads || []} />
        )}
      </div>

      <div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          className="p-5 w-[1000px] max-h-[600px]"
        >
          <CreateThreadForm
            userId={userId}
            handleFormSubmit={handleCreateQuestion}
          />
        </Modal>
      </div>

    </div>
  );
};

interface TabItemProp {
  onClick: () => void;
  isActive: boolean;
  name: string;
}

const TabItem = ({ onClick, isActive, name }: TabItemProp) => {
  return (
    <div className="cursor-pointer">
      <p onClick={onClick}>{name}</p>
      <div
        className={`w-full h-[3px] bg-accent mt-2 ${isActive ? "block" : "hidden"}`}
      />
    </div>
  );
};
