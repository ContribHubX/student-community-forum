import { Link } from "react-router-dom"
import { FaArrowRightLong } from "react-icons/fa6";
import { Topic } from "@/types";
import { relatedTopics } from "../data/related-topic";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";

export const RelatedTopics = () => {
  return (
    <SidebarLayout
        className="hidden flex-col gap-6 lg:flex"
        width={325}
        height={"full"}
        position="right-6"
    >   
        <div className="rounded-2xl p-2 bg-primary shadow-slate-400 shadow-md dark:shadow-gray-900">
            <h1 className="ml-4 pt-2 text-primary-foreground">Related Topics</h1>

            <div className="bg-primary text-primary-foreground flex flex-col p-4 gap-4">
                {relatedTopics.map(topic => (
                    <RelatedTopicItem
                        key={topic.id}
                        topic={topic}
                    />
                ))}
            </div>
        </div>
    </SidebarLayout>
  )
}


interface RelatedTopicItemProp {
    topic: Topic
}

const RelatedTopicItem = ({ topic }: RelatedTopicItemProp) => {

    return (
        <div className="flex gap-4 cursor-pointer">
            <div
            className={``}
            >
                <img 
                    src={topic.attachment} 
                    alt="" 
                    className="h-16 w-16 rounded-md" 
                />
            </div>

            <div className="flex flex-col flex-1 justify-center">
                <p className="text-sm">{topic.name}</p>
                <p className="text-xs text-muted-foreground justify-self-end">by Kidlat </p>
            </div>

            <Link to="" className="self-center">
                <FaArrowRightLong className="text-xs text-muted-f" />
            </Link>
        </div>
    )
}
