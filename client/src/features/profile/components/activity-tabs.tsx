import { useState } from "react";
import { Thread, Question, Topic } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ActivityTabsProp {
  threads: Thread[] | undefined;
  questions: Question[] | undefined;
  topics: Topic[] | undefined;
}

export const ActivityTabs = ({
  threads,
  questions,
  topics,
}: ActivityTabsProp) => {
  const [activeTab, setActiveTab] = useState("threads");

  if (!threads || !questions || !topics) return <p>Loading...</p>;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-primary">
        <TabsTrigger
          value="threads"
          className="data-[state=active]:text-primary-foreground"
        >
          Threads
        </TabsTrigger>
        <TabsTrigger
          value="questions"
          className="data-[state=active]:text-primary-foreground"
        >
          Questions
        </TabsTrigger>
        <TabsTrigger
          value="topics"
          className="data-[state=active]:text-primary-foreground"
        >
          Topics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="threads" className="text-primary-foreground">
        <Card className="dark:border-none">
          <CardHeader className="bg-primary dark:border-none">
            <CardTitle>Threads</CardTitle>
            <CardDescription>Your created threads</CardDescription>
          </CardHeader>
          <CardContent className="bg-primary text-primary-foreground dark:border-none">
            <ul className="space-y-4">
              {threads.map((thread) => (
                <li
                  key={thread.id}
                  className="dark:bg-background p-4 rounded-lg shadow"
                >
                  <h3 className="font-semibold text-lg">{thread.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {thread.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{thread.likeCount} likes</span>
                    <span>{thread.commentCount} comments</span>
                    <span>
                      {new Date(thread.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="questions">
        <Card className="dark:border-none">
          <CardHeader className="bg-primary dark:border-none">
            <CardTitle>Questions</CardTitle>
            <CardDescription>Your asked questions</CardDescription>
          </CardHeader>
          <CardContent className="bg-primary text-primary-foreground dark:border-none">
            <ul className="space-y-4">
              {questions.map((question) => (
                <li
                  key={question.id}
                  className="dark:bg-background p-4 rounded-lg shadow"
                >
                  <h3 className="font-semibold text-lg">{question.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {question.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{question?.topic?.name}</span>
                    <span>
                      {new Date(question.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="topics">
        <Card className="dark:border-none">
          <CardHeader className="bg-primary dark:border-none">
            <CardTitle>Topics</CardTitle>
            <CardDescription>
              Topics you've created or contributed to
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-primary text-primary-foreground dark:border-none">
            <ul className="space-y-4">
              {topics.map((topic) => (
                <li
                  key={topic.id}
                  className="dark:bg-background p-4 rounded-lg shadow"
                >
                  <h3 className="font-semibold text-lg">{topic.name}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{topic.followerCount} 12 followers</span>
                    <span>
                      {new Date(topic.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
