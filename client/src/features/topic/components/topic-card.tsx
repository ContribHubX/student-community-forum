import { Topic } from "@/types";

interface TopicCardProp {
  topic: Topic;
}

export const TopicCard = ({ topic }: TopicCardProp) => {
  return (
    <div className="p-4 bg-primary rounded-md flex  gap-3">
      <img
        src={topic.attachment}
        alt="image"
        className="max-w-[120px] object-cover rounded-md border"
      />

      <div className="text-primary-foreground">
        <h1 className="font-semibold text-xl">{topic.name}</h1>
      </div>
    </div>
  );
};
