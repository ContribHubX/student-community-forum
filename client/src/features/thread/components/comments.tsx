import { useCommentContext } from "../hooks/use-comment-context";
import { CommentList } from "./comment-list";

export const Comments = () => {
  const { state } = useCommentContext();

  return (
    <div>
      <CommentList comments={state.comments} />
    </div>
  );
};
