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
  Bookmark,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { GrEdit } from "react-icons/gr";
import { FaTrashAlt } from "react-icons/fa";

import { ReactionType, Thread } from "@/types";
import { statusColors } from "@/features/workspace/constant";
import { sanitizeContent } from "@/utils";
import { useCreateReaction } from "../api/create-reaction";
import { useGetUserReaction } from "../api/get-reaction";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

import { TbArrowBigDown } from "react-icons/tb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetCommunityById } from "@/features/community/api/get-community";
import { useDeleteThread } from "../api/delete-thread";
import { useSavedThread } from "../api/save-thread";
import { useQueryClient } from "@tanstack/react-query";

import {
  createReactionMutationConfig,
  saveThreadMutationConfig,
} from "../optimistic-mutations";
import { toast } from "react-toastify";

interface ThreadCardProp {
  thread: Thread;
  userId: string;
}

export const ThreadCard = ({ userId, thread }: ThreadCardProp) => {
  const queryClient = useQueryClient();
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const { mutate: addReaction } = useCreateReaction({
    mutationConfig: createReactionMutationConfig(queryClient, userId, thread),
  });

  const { mutate: saveThread } = useSavedThread({
    mutationConfig: saveThreadMutationConfig(queryClient, thread),
  });

  const { mutate: deleteThread } = useDeleteThread({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Post deleted successfully");
      },
    },
  });

  const { data: reaction } = useGetUserReaction({
    data: { threadId: thread.id, userId: userId.toString() || "" },
  });

  const { data: community } = useGetCommunityById({
    id: thread.communityId || "",
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

  const onSubmitReaction = (type: ReactionType) => {
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
    <Card className="w-full hover:shadow-lg transition-shadow duration-300  bg-primary dark:border-none">
      <CardHeader className="xs:-space-y-3">
        <div className="flex flex-row items-start space-y-0 gap-4 ">
          <Avatar className="w-10 h-10">
            <AvatarImage src={thread.createdBy?.attachment} alt="User Avatar" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0 w-full ">
            <div className="flex items-start justify-between">
              <div className="flex items-start xs:items-center gap-2  w-full flex-col xs:flex-row">
                <span className="text-sm font-medium">
                  {thread.createdBy.name}
                </span>
                <Badge
                  variant="secondary"
                  className="text-xs  font-normal"
                  style={{
                    color: statusColors["archived"].text,
                    backgroundColor: !isDark
                      ? statusColors["archived"].background
                      : "#1e252b",
                  }}
                >
                  {formatDistanceToNow(
                    new Date(thread.createdAt || new Date()),
                    {
                      addSuffix: true,
                    },
                  )}
                </Badge>
              </div>
              {community && (
                <Badge
                  variant="secondary"
                  className="flex self-start w-max items-center gap-1 pl-2 md:pr-6 py-1 ml-auto dark:bg-background cursor-pointer"
                  onClick={() => navigate(`/community/${community.id}`)}
                >
                  {community.icon && (
                    <img
                      src={community.icon}
                      alt={`${community.name} icon`}
                      className="w-4 h-4 rounded-full"
                    />
                  )}
                  <span className="hidden sm:block whitespace-nowrap">
                    {community.name}
                  </span>
                </Badge>
              )}
            </div>
          </div>
        </div>
        <h3
          className="text-lg font-semibold hover:text-accent cursor-pointer transition-colors duration-200
              xs:ml-14 
          "
          onClick={() => navigate(`/thread/${thread.id}`)}
        >
          {thread.title}
        </h3>
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
      <CardFooter
        className={`flex justify-between items-center -mb-2 
            ${thread.attachment !== "null" ? "-mt-1" : "-mt-5 -mb-1"}
        `}
      >
        <div className="flex items-center xs:space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant={reactionFlag("LIKE") ? "default" : "ghost"}
                    className="px-2 disabled:opacity-100"
                    onClick={() => onSubmitReaction("LIKE")}
                    onMouseEnter={() => setUpHovered(true)}
                    onMouseLeave={() => setUpHovered(false)}
                    disabled={reactionFlag("LIKE") || reactionFlag("DISLIKE")}
                  >
                    <TbArrowBigDown
                      className="text-3xl rotate-180  text-white"
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
                    className="px-2 disabled:opacity-100"
                    onClick={() => onSubmitReaction("DISLIKE")}
                    onMouseEnter={() => setDownHovered(true)}
                    onMouseLeave={() => setDownHovered(false)}
                    disabled={reactionFlag("LIKE") || reactionFlag("DISLIKE")}
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
                  <span className="text-sm font-medium mx-1">
                    {thread.dislikeCount}
                  </span>
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
            onClick={() => navigate(`/thread/${thread.id}`)}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm flex items-center gap-3">
              <span>{thread.commentCount || 0} </span>
              <span className="hidden md:block">comments</span>
            </span>
          </Button>
        </div>
        <div className="flex items-center sm:space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ShareOptions threadId={thread.id} />
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${thread.isSaved && "bg-accent text-accent-foreground"} disabled:opacity-100`}
                  onClick={() =>
                    saveThread({
                      userId,
                      threadId: thread.id,
                    })
                  }
                  disabled={thread.isSaved}
                >
                  <Bookmark className={`h-4 w-4`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ThreadMenu
            onEdit={() => navigate(`/thread-action/${thread.id}`)}
            onDelete={() => deleteThread({ threadId: thread.id, userId })}
            isCurrentUserThread={
              userId.toString() === thread?.createdBy?.id.toString()
            }
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
      <PopoverContent className="w-[100px] p-0 bg-primary dark:bg-background dark:border-none">
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

interface ShareOptionsProps {
  threadId: string;
}

export const ShareOptions = ({ threadId }: ShareOptionsProps) => {
  const shareOptions = [
    { icon: Facebook, label: "Facebook", action: () => shareTo("facebook") },
    { icon: Twitter, label: "Twitter", action: () => shareTo("twitter") },
    { icon: Linkedin, label: "LinkedIn", action: () => shareTo("linkedin") },
    { icon: Link, label: "Copy Link", action: () => copyLink() },
  ];

  const shareTo = (platform: string) => {
    const url = `https://example.com/thread/${threadId}`;
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
          "_blank",
        );
        break;
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://example.com/thread/${threadId}`);
    alert("Link copied to clipboard!");
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-2 rounded-lg bg-primary dark:bg-dark dark:border-none">
        <div className="flex flex-col gap-2">
          {shareOptions.map((option, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 justify-start w-full px-3 hover:bg-accent hover:text-accent-foreground rounded-md"
                    onClick={option.action}
                  >
                    <option.icon className="h-4 w-4" to="" />
                    <span className="text-sm">{option.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{option.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
