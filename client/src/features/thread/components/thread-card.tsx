import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GrEdit } from "react-icons/gr";
import { FaTrashAlt } from "react-icons/fa";

import { ReactionType, Thread } from "@/types";
import { statusColors } from "@/features/workspace/constant";
import { sanitizeContent } from "@/utils";
import { useCreateReaction } from "../api/create-reaction";
import { useGetUserReaction } from "../api/get-reaction";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

import { TbArrowBigDown } from "react-icons/tb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ThreadCardProp {
  thread: Thread;
  userId: string;
}

export const ThreadCard = ({ userId, thread }: ThreadCardProp) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const { mutate: addReaction } = useCreateReaction({});
  const { data: reaction } = useGetUserReaction({
    data: { threadId: thread.id, userId: userId.toString() || "" },
  });
  const { isDark } = useTheme();
  const navigate = useNavigate();

  let sanitizedContent = sanitizeContent(thread?.content || "");
  sanitizedContent =
    sanitizedContent.length < 150
      ? sanitizedContent
      : sanitizedContent.substring(0, 150) + "...";
  const [isUpHovered, setUpHovered] = useState(false);
  const [isDownHovered, setDownHovered] = useState(false);

  const toggleImageSize = () => {
    setIsImageExpanded((prev) => !prev);
  };

  const onSubmitReaction = (type: string) => {
    const data = {
      threadId: thread.id,
      userId: userId.toString(),
      type: type,
    };
    addReaction(data);
  };

  const reactionFlag = (keyType: ReactionType) => {
    return reaction?.type === keyType;
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 bg-primary dark:border-none">
      <CardHeader className="flex flex-row items-start space-y-0 gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={thread.createdBy?.attachment} alt="User Avatar" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">Kidlat 101</span>
            <Badge
              variant="secondary"
              className="text-xs font-normal"
              style={{
                color: statusColors["archived"].text,
                backgroundColor: !isDark
                  ? statusColors["archived"].background
                  : "#1e252b",
              }}
            >
              {formatDistanceToNow(new Date(thread.createdAt || new Date()), {
                addSuffix: true,
              })}
            </Badge>
          </div>
          <h3
            className="text-lg font-semibold hover:text-accent cursor-pointer transition-colors duration-200"
            onClick={() => navigate(`/thread/${thread.id}`)}
          >
            {thread.title}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className="text-sm text-muted-foreground mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></p>
        <div className="flex flex-wrap gap-2 mb-4">
          {thread.tags?.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-accent-foreground bg-accent border-none p-2"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        {thread.attachment !== "null" && (
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={thread.attachment}
              alt="Thread attachment"
              className={`w-full object-cover transition-all duration-300 ease-in-out ${
                isImageExpanded ? "max-h-[600px]" : "max-h-[200px]"
              }`}
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-2 right-2 bg-primary"
              onClick={toggleImageSize}
            >
              {isImageExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant={reactionFlag("LIKE") ? "default" : "ghost"}
                    className="px-2"
                    onClick={() => onSubmitReaction("LIKE")}
                    onMouseEnter={() => setUpHovered(true)}
                    onMouseLeave={() => setUpHovered(false)}
                  >
                    <TbArrowBigDown
                      className="text-3xl rotate-180 text-white"
                      style={{
                        color:
                          isDark || isUpHovered || reactionFlag("LIKE")
                            ? "#ffffff"
                            : "black",
                      }}
                    />
                  </Button>
                  <span className="text-sm font-medium mx-1">
                    {thread.likeCount}
                  </span>
                  <Button
                    size="sm"
                    variant={reactionFlag("DISLIKE") ? "default" : "ghost"}
                    className="px-2"
                    onClick={() => onSubmitReaction("DISLIKE")}
                    onMouseEnter={() => setDownHovered(true)}
                    onMouseLeave={() => setDownHovered(false)}
                  >
                    <TbArrowBigDown
                      className="text-2xl"
                      style={{
                        color:
                          isDark || isDownHovered || reactionFlag("DISLIKE")
                            ? "#ffffff"
                            : "black",
                      }}
                    />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vote on this thread</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">19 comments</span>
          </Button>
        </div>
        <div>
          <ThreadMenu
            onEdit={() => navigate(`/thread-action/${thread.id}`)}
            onDelete={() => ""}
            isCurrentUserThread={userId === thread?.createdBy?.id}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

interface ThreadMenuProp {
  onEdit: () => void;
  onDelete: () => void;
  isCurrentUserThread: boolean;
}

export const ThreadMenu = ({
  onEdit,
  onDelete,
  isCurrentUserThread,
}: ThreadMenuProp) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] p-0">
        <div className="p-2">
          {isCurrentUserThread ? (
            <>
              <span
                className="cursor-pointer rounded-md p-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
                onClick={onEdit}
              >
                <GrEdit />
                <p className="text-sm">Edit</p>
              </span>
              <span
                className="rounded-md cursor-pointer p-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
                onClick={onDelete}
              >
                <FaTrashAlt className="" />
                <p className="text-sm">Delete</p>
              </span>
            </>
          ) : (
            <span>Hide</span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
