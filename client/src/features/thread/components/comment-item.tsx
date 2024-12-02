import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Comment } from "@/types";
import { CommentForm } from "@/features/thread/components/comment-form";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, MoreHorizontal, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

import { CommentList } from "./comment-list";
import { useCommentContext } from "../hooks/use-comment-context";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { state } = useCommentContext();

  if (!comment) return <p>Loading...</p>;

  const replies = (state.groupedComments[comment?.id] || []).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });

  //bg-primary hover:shadow-md transition-shadow
  return (
    <div className="mt-[-30px]">
      <Card className="overflow-hidden duration-300 bg-background shadow-none border-0">
        <CardContent className="p-4 pb-0">
          <div className="flex items-start gap-4">
            <div className="flex items-center flex-col">
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarImage
                  src={comment.createdBy.attachment}
                  alt={comment.createdBy.name}
                />
                <AvatarFallback>
                  {comment.createdBy.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {comment?.replies?.length !== 0 && (
                <div className="avatar-line w-[1px] h-[50px] bg-[#9ca1de]" />
              )}
            </div>
            <div className="flex-1 space-y-2 ">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {comment.createdBy.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: comment?.content }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-2 mmuted/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-primary"
              onClick={() => setIsLiked(!isLiked)}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isLiked ? (
                  <Heart className="w-4 h-4 fill-primary text-primary" />
                ) : (
                  <ThumbsUp className="w-4 h-4" />
                )}
              </motion.div>
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-primary"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageSquare className="w-4 h-4" />
              Reply
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">5 likes</span>
        </CardFooter>
        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <CommentForm
              threadId={comment.threadId}
              parentId={comment.id}
              placeholder="Write your reply..."
            />
          </motion.div>
        )}
      </Card>
      {/* nested shit */}

      {replies?.length > 0 && (
        <>
          <div className="flex">
            <button
              className="collapse-line "
              aria-label="Hide Replies"
              onClick={() => ""}
            />
            <div className="pl-8 flex-1">
              <CommentList comments={replies} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
