import { Comment } from "@/types";
import { CommentItem } from "./comment-item";

interface CommentReplyListProps {
  replies: Comment[];
}

export const CommentReplyList = ({ replies }: CommentReplyListProps) => {
  return (
    <div className="pl-8 space-y-4 py-4">
      {replies.map((reply, index) => (
        <CommentItem key={index} comment={reply} />
      ))}
    </div>
  );
};
