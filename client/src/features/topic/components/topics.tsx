import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { QuestionCardList } from "@/features/shared/components/question-card-list";
import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { useCreateQuestion } from "@/features/shared/api/create-question";
import { Insight } from "@/features/shared/components/insight";
import { CreateQuestionForm } from "@/features/shared/components/create-question-form";
import { useCreateThread } from "@/features/shared/api/create-thread";
import { useGetQuestions } from "@/features/shared/api/get-all-question";
import { CreateQuestionType } from "@/features/shared/api/create-question";

import { Modal } from "@/components/ui/modal";
import { useDisclosure } from "@/hooks/use-disclosure";
import { TopicCard } from "./topic-card";
import { useGetTopic } from "../api/get-topic";
import { formDataToObject } from "@/utils";
import { useGetThreadsByTopic } from "../api/get-threads-by-topic";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface TopicsProp {
  userId: string;
}

type ActiveTabType = "Read" | "Answer";

export const Topics = ({ userId }: TopicsProp) => {
  const { topicId } = useParams();
  const [activeTab, setActiveTab] = useState<ActiveTabType>("Answer");
  const { isOpen: isModalOpen, close: closeModal } = useDisclosure();

  const { mutate: createQuestion } = useCreateQuestion({
    mutationConfig: {
      onSuccess: () => {
        toast.success("question submitted");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          ///error
          /// toast.error(error.response.data.message)
        }
      },
    },
  });

  const { mutate: createThread } = useCreateThread({});
  const {
    data: questions,
    isLoading: questionsLoading,
    refetch,
  } = useGetQuestions({ topicId: topicId || "" });
  const { data: topic } = useGetTopic({
    data: { topicId: topicId!, userId: userId! },
  });
  const { data: threads } = useGetThreadsByTopic({ topicId: topicId || "" });

  const handleCreateQuestion = (data: FormData) => {
    data.append("topicId", topicId || "");
    createQuestion(formDataToObject(data) as CreateQuestionType);
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
    <div className="">
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
            <QuestionCardList questions={questions} />
          ) : (
            <Insight />
          )
        ) : (
          <ThreadCardList threads={threads || []} />
        )}
      </div>

      <div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          className="p-5 w-[1200px]  max-h-[600px] bg-red-400"
        >
          <CreateQuestionForm
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
