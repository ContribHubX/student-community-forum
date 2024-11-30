import { useContext } from "react";
import { CommentContext } from "../provider/comment";

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error(
      "useCommentContext must be used within a CommentContextProvider",
    );
  }
  return context;
};
