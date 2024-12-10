import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Comment } from "@/types";
import { CommentForm } from "@/features/thread/components/comment-form";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, MoreHorizontal, Heart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

import { CommentList } from "./comment-list";
import { useCommentContext } from "../hooks/use-comment-context";
import { useDeleteComment } from "../api/delete-comment";

interface CommentItemProps {
  comment: Comment;
  depth?: number;
}

export const CommentItem = ({ comment, depth = 0 }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const { state } = useCommentContext();
  const { mutate: deleteComment } = useDeleteComment({});

  if (!comment) return <p>Loading...</p>;

  const replies = (state.groupedComments[comment?.id] || []).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });

  const hasReplies = replies.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative ${depth > 0 ? 'ml-6' : ''}`}
    >
      <Card className="overflow-hidden duration-300 bg-gradient-to-br from-primary to-primary/80 shadow-md dark:bg-primary dark:border-none  hover:shadow-lg transition-all border border-primary/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10 border-2 border-primary shadow-md">
              <AvatarImage src={comment.createdBy.attachment} alt={comment.createdBy.name} />
              <AvatarFallback>{comment.createdBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-primary-foreground">{comment.createdBy.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border border-primary/20">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteComment({ commentId: comment.id })}>
                      Delete
                    </DropdownMenuItem>
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
        <CardFooter className="px-4 py-2 -mt-4 flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsLiked(!isLiked)}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isLiked ? (
                  <Heart className="w-4 h-4 fill-primary text-accent" />
                ) : (
                  <ThumbsUp className="w-4 h-4" />
                )}
              </motion.div>
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageSquare className="w-4 h-4" />
              Reply
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">5 likes</span>
        </CardFooter>
      </Card>
      <AnimatePresence>
        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <CommentForm
              threadId={comment.threadId}
              parentId={comment.id}
              placeholder="Write your reply..."
              onSubmitCallback={() => setShowReplyForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {hasReplies && (
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foregroundry hover:text-accent-foreground transition-colors"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide Replies" : `Show ${replies.length} Replies`}
          </Button>
          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <CommentList comments={replies} depth={depth + 1} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

