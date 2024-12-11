import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { Topic } from "@/types";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { useGetTopics } from "../api";

export const RelatedTopics = () => {
  const { data: topics } = useGetTopics({});

  return (
    <SidebarLayout
      className="hidden flex-col gap-6 lg:flex 
        lg:w-[270px]
        xl:w-[300px]
      "
      height={"full"}
      position="right-6"
    >
      <div className="rounded-2xl p-2 bg-primary shadow-slate-400 shadow-md dark:shadow-gray-900">
        <h1 className="ml-4 pt-2 text-primary-foreground">Related Topics</h1>

        <div className="bg-primary text-primary-foreground flex flex-col p-4 gap-4">
          {topics?.map((topic) => (
            <Link to={`/topic/${topic.id}`}>
              <RelatedTopicItem key={topic.id} topic={topic} />
            </Link>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
};

interface RelatedTopicItemProp {
  topic: Topic;
}

const RelatedTopicItem = ({ topic }: RelatedTopicItemProp) => {
  return (
    <div className="flex gap-4 cursor-pointer">
      <div className={``}>
        <img src={topic.attachment} alt="" className="h-16 w-16 rounded-md" />
      </div>

      <div className="flex flex-col flex-1 justify-center">
        <p className="text-sm">{topic.name}</p>
        <p className="text-xs text-muted-foreground justify-self-end">
          by Kidlat{" "}
        </p>
      </div>

      <Link to="" className="self-center">
        <FaArrowRightLong className="text-xs text-muted-f" />
      </Link>
    </div>
  );
};
