import { QuestionCardList } from "@/features/shared/components/question-card-list";
import { TopicCard } from "./topic-card";
import { Topic } from "@/types";
import { useState } from "react";
import { ThreadCardList } from "@/features/thread/components/thread-card-list";
import { sampleQuestions } from "@/features/shared/data/questions";

const topic: Topic = {
  id: "123",
  name: "Machine Learning",
  attachment:
    "https://static.vecteezy.com/system/resources/previews/035/742/223/non_2x/artificial-intelligent-icon-line-icon-for-your-website-mobile-presentation-and-logo-design-vector.jpg",
  createdBy: null,
  followerCount: 1100,
};

type ActiveTabType = "Read" | "Answer";

export const Topics = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("Answer");

  const toggleActiveTab = () => {
    setActiveTab(activeTab === "Answer" ? "Read" : "Answer");
  };

  return (
    <div>
      <div>
        <TopicCard topic={topic} />
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

      <div className="mt-4">
        {activeTab === "Answer" ? (
          <QuestionCardList questions={sampleQuestions} />
        ) : (
          <ThreadCardList />
        )}
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
