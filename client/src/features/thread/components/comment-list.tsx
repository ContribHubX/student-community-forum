import { useAuth } from "@/hooks/use-auth";
import { CommentItem } from "./comment-item";
import { Comment } from "@/types";

interface CommentListProps {
  comments: Comment[];
  depth?: number;
}

export const CommentList = ({ comments, depth = 0 }: CommentListProps) => {
  const { authState } = useAuth();

  return (
    <div
      className={`space-y-6 ${depth > 0 ? "pl-6 border-l-2 border-primary/20" : ""}`}
    >
      {comments?.map((comment, index) => (
        <CommentItem
          currentUserId={authState.user?.id || ""}
          key={comment.id || index}
          comment={comment}
          depth={depth}
        />
      ))}
    </div>
  );
};
