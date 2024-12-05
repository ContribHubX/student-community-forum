import { useState } from "react";
import { Topic } from "@/types";
import { MdOutlineRssFeed } from "react-icons/md";
import { BsVectorPen } from "react-icons/bs";
import { CreateQuestionForm } from "@/features/shared/components/create-question-form";
import { CreateQuestionType } from "@/features/shared/api/create-question";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetTopicFollowers } from "../api/get-followers";
import { formDataToObject } from "@/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useFollowTopic } from "../api/follow-topic";

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
  const { mutate: follow } = useFollowTopic({});
  const [postType, setPostType] = useState("thread");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: FormData) => {
    data.append("topicId", topic.id || "");

    if (postType === "thread") createThread(data);
    else createQuestion(formDataToObject(data) as CreateQuestionType);
  };

  const handleSelectChange = (value: string) => {
    setPostType(value);
    if (value === "question") {
      setIsDialogOpen(true);
    }
  };

  const handleFollow = () => {
    follow({
      followerId: userId.toString(),
      topicId: topic.id,
    });
  };

  const isUserFollower = () => {
    return followers?.length
      ? followers.some(
          (follower) => follower.id.toString() === userId.toString(),
        )
      : false;
  };

  if (!topic || !topic.name) return <p>Loading...</p>;

  return (
    <Card className="border-none w-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-primary">
      <CardHeader className="p-0">
        <img
          src={topic.attachment}
          alt={topic.name}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-6 ">
        <div className="flex items-center justify-between mb-1 ">
          <h2 className="text-2xl font-bold">{topic.name}</h2>
          <Badge variant="secondary" className="bg-background">
            Learn and education
          </Badge>
        </div>
        <div className="flex  gap-2 flex-col">
          <div className="flex items-center text-sm text-muted-foreground">
            <MdOutlineRssFeed className="mr-2" />
            <span>{followers?.length || 0} Followers</span>
          </div>
          <Button
            variant={"default"}
            size="sm"
            onClick={handleFollow}
            className="transition-all duration-300 text-sm w-fit hover:scale-105 text-accent-foreground disabled:bg-background disabled:text-primary-foreground"
            disabled={isUserFollower()}
          >
            {isUserFollower() ? "Following" : "Follow"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="hover:bg-accent group ">
              <Button
                variant="outline"
                size="sm"
                className="flex px-1 items-center text-sm border-none group-hover:bg-accent group-hover:text-accent-foreground transition-none"
              >
                <BsVectorPen className="mr-2" />
                Create Post
              </Button>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thread">Thread</SelectItem>
              <SelectItem value="question">Question</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] min-w-[730px] bg-primary">
            <CreateQuestionForm
              initialTopic={topic}
              userId={userId}
              handleFormSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
        <Avatar>
          <AvatarImage src={topic.attachment} alt={topic.name} />
          <AvatarFallback>{topic.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardFooter>
    </Card>
  );
};
