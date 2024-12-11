import { CommentItem } from "./comment-item";
import { Comment } from "@/types";

interface CommentListProps {
  comments: Comment[];
  depth?: number;
}

export const CommentList = ({ comments, depth = 0 }: CommentListProps) => {
  return (
    <div
      className={`space-y-6 ${depth > 0 ? "pl-6 border-l-2 border-primary/20" : ""}`}
    >
      {comments?.map((comment, index) => (
        <CommentItem
          key={comment.id || index}
          comment={comment}
          depth={depth}
        />
      ))}
    </div>
  );
};
