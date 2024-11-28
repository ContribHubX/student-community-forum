import { Topic } from "@/types";

import { MdOutlineRssFeed } from "react-icons/md";
import { BsVectorPen } from "react-icons/bs";

import { useGetTopicFollowers } from "../api/get-followers";

interface TopicCardProp {
  topic: Topic;
}

export const TopicCard = ({ topic }: TopicCardProp) => {
  const { data: followers } = useGetTopicFollowers({ topicId: topic.id });

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
          <div className="group bg-background w-fit p-2 rounded-md hover:scale-125 transition-transform cursor-pointer hover:bg-accent">
            <BsVectorPen className="text-lg group-hover:text-white" />
          </div>
          <div className="flex items-center gap-2 bg-background w-fit p-2 rounded-md ">
            <MdOutlineRssFeed className="text-xl" />
            <span className="text-xs">{followers?.length || 0} Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
