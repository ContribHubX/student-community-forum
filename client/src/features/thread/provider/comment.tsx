import { createContext, useReducer, PropsWithChildren, useEffect } from "react";

import { Comment } from "@/types";
import { useParams } from "react-router-dom";
import { useGetThreadComments } from "../api/get-thread-comments";

interface CommentState {
    comments: Comment[];
    groupedComments: Record<string, Comment[]>
}

export type CommentAction =
  | { type: "SET_COMMENTS"; payload: Comment[] }
  | { type: "SET_GROUPED_COMMENTS"; payload: Comment[] }


const initialCommentState: CommentState = {
    comments: [],
    groupedComments: {}
};

const boardReducer = (state: CommentState, action: CommentAction): CommentState => {
  switch (action.type) {
    case "SET_COMMENTS":
        return {...state, comments: action.payload.filter(comm => comm.parentId === null)};
    case "SET_GROUPED_COMMENTS": {
      const comments = action.payload;
      const group: Record<string, Comment[]> = {};

      comments.forEach(comment => {
        if (comment.parentId) {
          group[comment.parentId] ||= []
          group[comment.parentId].push(comment)
        }
      })

      return {...state, groupedComments: group};
    }
    default: 
        return {...state};
  }
};

export const CommentContext = createContext<
  { state: CommentState; dispatch: React.Dispatch<CommentAction> } | undefined
>(undefined);

export const CommentContextProvider = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
   
  const { data: comments } = useGetThreadComments({ threadId: id || "" });
  const [state, dispatch] = useReducer(boardReducer, initialCommentState);

  useEffect(() => {
    if (!comments) return;

    dispatch({
      type: "SET_COMMENTS", 
      payload: comments
    })

    
    dispatch({
      type: "SET_GROUPED_COMMENTS", 
      payload: comments
    })
  }, [comments])

  console.log(comments);

  return (
    <CommentContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentContext.Provider>
  );
};
