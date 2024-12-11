import { FlexContainer } from "@/components/ui/flex-container";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateBoardForm } from "./create-board-form";
import { Board } from "./board";

import { HiSortDescending } from "react-icons/hi";
import { CiGrid41 } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { HiOutlineViewBoards } from "react-icons/hi";

import yellowStar from "@/assets/workspace/yellow-star.svg";
import pinkStar from "@/assets/workspace/pink-star.svg";
// import pencil from "@/assets/workspace/pencil.svg";

import { useBoardContext } from "../hooks/use-board-context";

interface WorkspaceProp {
  userId: string | undefined;
}

export const Workspace = ({ userId }: WorkspaceProp) => {
  const { state } = useBoardContext();

  return (
    <div>
      <FlexContainer className="justify-between  text-sm text-primary-foreground">
        <FlexContainer className="gap-3">
          <HiOutlineViewBoards className="text-2xl font-semibold" />
          <p className="text-sm font-semibold">My Boards</p>
        </FlexContainer>

        <div className="flex items-center gap-4">
          {/* <div className="flex border items-center gap-2 "> 
            <p className="text-sm">Sort by (Default)</p>
            <HiSortDescending className="text-xl text-muted-foreground hover:text-accent" />
          </div> */}
          <div className="flex justify-center gap-3 text-3xl text-muted-foreground">
            <HiSortDescending className="border rounded-md p-[4px] hover:text-accent" />
            <CiGrid41 className="border rounded-md p-[4px] hover:text-accent" />
            <FiMenu className="border rounded-md  p-[4px] hover:text-accent" />
          </div>
        </div>
      </FlexContainer>

      <div
        className={`mt-4 grid gap-5
            md:grid-cols-2
            lg:grid-cols-4
        `}
      >
        <Dialog>
          <DialogTrigger>
            <CreateBoardCard />
          </DialogTrigger>
          <DialogContent className="p-0 w-[300px] bg-primary dark:border-0">
            <div className="mt-4" />
            <CreateBoardForm userId={userId} />
          </DialogContent>
        </Dialog>
        {state.boards?.map((board) => <Board key={board.id} board={board} />)}
      </div>

      {/* shared */}
      <FlexContainer className="justify-between  text-sm text-primary-foreground mt-8">
        <FlexContainer className="gap-3">
          <HiOutlineViewBoards className="text-2xl font-semibold" />
          <p className="text-sm font-semibold">Shared Boards</p>
        </FlexContainer>

        <div className="flex items-center gap-4">
          <div className="flex justify-center gap-3 text-3xl text-muted-foreground">
            <HiSortDescending className="border rounded-md p-[4px] hover:text-accent" />
            <CiGrid41 className="border rounded-md p-[4px] hover:text-accent" />
            <FiMenu className="border rounded-md  p-[4px] hover:text-accent" />
          </div>
        </div>
      </FlexContainer>

      <div
        className={`mt-4 grid gap-5
            md:grid-cols-2
            lg:grid-cols-4
        `}
      >
        {state.sharedBoards?.map((board) => (
          <Board key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
};

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const CreateBoardCard = () => {
  return (
    <motion.div
      className="bg-primary text-primary-foreground rounded-lg px-6 py-5 h-[200px] shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative flex flex-col h-full justify-between">
        <div className="absolute inset-0">
          <motion.img
            src={yellowStar}
            alt="star"
            className="absolute w-[25px] top-3 left-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.img
            src={pinkStar}
            alt="star"
            className="absolute w-[20px] top-16 left-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.img
            src={yellowStar}
            alt="star"
            className="absolute w-[25px] top-28 left-28"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.img
            src={pinkStar}
            alt="star"
            className="absolute w-[25px] top-7 right-5"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative w-24 h-24"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-[#533de0] opacity-20 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-2 bg-[#533de0] opacity-30 rounded-full"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="absolute inset-4 bg-[#533de0] opacity-40 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-12 h-12 bg-[#533de0] rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Plus className="text-white w-8 h-8" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <p className="font-bold text-lg self-end mx-auto w-fit text-center mt-4 relative z-10">
          Create new board
        </p>
      </div>
    </motion.div>
  );
};

export default CreateBoardCard;
