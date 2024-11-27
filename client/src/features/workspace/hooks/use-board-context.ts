import { useContext } from "react";
import { BoardContext } from "../provider/board";

export const useBoardContext = () => {
    const context = useContext(BoardContext);
    if (!context) {
      throw new Error("useBoardContext must be used within a BoardContextProvider");
    }
    return context;
};
  