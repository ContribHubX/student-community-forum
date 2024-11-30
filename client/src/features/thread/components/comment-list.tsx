import { CommentItem } from "./comment-item";
import { Comment } from "@/types";

interface CommentListProp {
  comments: Comment[]
}

export const CommentList = ({ comments }: CommentListProp) => {

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-6">
        {comments?.map((comment, index) => (
          <CommentItem 
            key={index} 
            comment={comment} 
          />
        ))}
      </div>
    </div>
  );
};

