import { createContext, useReducer, useEffect, PropsWithChildren } from "react";
 
import { useAuth } from "@/hooks/use-auth"; 
import { useGetBoards } from "../api/get-all-boards";
import { useGetSharedBoards } from "../api/get-shared-boards";

import { Board } from "@/types";



interface BoardState {
  boards: Board[];
  sharedBoards: Board[];
  loading: boolean;
  error: string | null;
}

// Types for actions
export type BoardAction =
  | { type: "SET_BOARDS"; payload: Board[] }
  | { type: "SET_SHARED_BOARDS"; payload: Board[] }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string };

// Define the initial state
const initialBoardState: BoardState = {
  boards: [],
  sharedBoards: [],
  loading: true,
  error: null,
};

// Reducer function to handle the state updates
const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case "SET_BOARDS":
      return { ...state, boards: action.payload, loading: false };
    case "SET_SHARED_BOARDS":
      return { ...state, sharedBoards: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Create the BoardContext
export const BoardContext = createContext<{ state: BoardState; dispatch: React.Dispatch<BoardAction> } | undefined>(undefined);

// BoardContextProvider component to provide the context
export const BoardContextProvider = ({ children }: PropsWithChildren) => {
  const { authState } = useAuth();
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);

  const { data: boards, isLoading: boardsLoading, error: boardsError } = useGetBoards({
    userId: authState?.user?.id.toString() || "",
  });
  const { data: sharedBoards, isLoading: sharedBoardsLoading, error: sharedBoardsError } = useGetSharedBoards({
    userId: authState?.user?.id.toString() || "",
  });


  // useEffect(() => {
  //   const boardsData = [...(boards || []), ...(sharedBoards || [])];

  //   socketDispatch({
  //       type: OPERATION.INITIALIZE_BOARDS,
  //       payload: { data: boardsData }
  //   }) 

  // }, [boards, sharedBoards, socketDispatch])

  useEffect(() => {
    if (boardsLoading || sharedBoardsLoading) {
      dispatch({ type: "SET_LOADING" });
    }

    if (boardsError || sharedBoardsError) {
      dispatch({ type: "SET_ERROR", payload: "Error loading boards" });
      return;
    }

    if (boards && sharedBoards) {
      // Dispatch to set boards and shared boards
      dispatch({ type: "SET_BOARDS", payload: boards });
      dispatch({ type: "SET_SHARED_BOARDS", payload: sharedBoards });
    }
  }, [boards, sharedBoards, boardsLoading, sharedBoardsLoading, boardsError, sharedBoardsError]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

