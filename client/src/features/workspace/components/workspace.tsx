import { FlexContainer } from "@/components/ui/flex-container";
import { Modal } from "@/components/ui/modal";
import { CreateBoardForm } from "./create-board-form";
import { Board } from "./board";

import { HiSortDescending } from "react-icons/hi";
import { CiGrid41 } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { HiOutlineViewBoards } from "react-icons/hi";

import yellowStar from "@/assets/workspace/yellow-star.svg";
import pinkStar from "@/assets/workspace/pink-star.svg";
// import pencil from "@/assets/workspace/pencil.svg";

import { useDisclosure } from "@/hooks/use-disclosure";
import { useGetBoards } from "../api/get-all-boards";
import { useGetSharedBoards } from "../api/get-shared-boards";

interface WorkspaceProp {
  userId: string | undefined;
}

export const Workspace = ({ userId }: WorkspaceProp) => {
  const { isOpen, toggle, close } = useDisclosure();
  const { data: boards } = useGetBoards({ userId: userId || "" });
  const { data: sharedBoards } = useGetSharedBoards({ userId: userId || "" });

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
        <div onClick={toggle}>
          <CreateBoardCard />
        </div>
        {/* {"12345679000".split("").map((el, index) => (
          <Board key={index} />
        ))} */}
        {boards?.map((board) => <Board key={board.id} board={board} />)}
      </div>

      <div>
        <Modal isOpen={isOpen} onClose={close}>
          <CreateBoardForm userId={userId} />
        </Modal>
      </div>



      {/* shared */}
      <FlexContainer className="justify-between  text-sm text-primary-foreground mt-8">
        <FlexContainer className="gap-3">
          <HiOutlineViewBoards className="text-2xl font-semibold" />
          <p className="text-sm font-semibold">Shared Boards</p>
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
      
        {/* {"12345679000".split("").map((el, index) => (
          <Board key={index} />
        ))} */}
        {sharedBoards?.map((board) => <Board key={board.id} board={board} />)}
      </div>
    </div>
  );
};

const CreateBoardCard = () => {
  return (
    <div className="bg-primary  text-primary-foreground rounded-md  px-5 py-4 h-[200px]  shadow-md">
      <div className="relative flex h-full">
        <div>
          <img
            src={yellowStar}
            alt="star"
            className="absolute w-[20px] top-3 left-8"
          />
          <img
            src={pinkStar}
            alt="star"
            className="absolute w-[15px] top-16 left-2"
          />
          <img
            src={yellowStar}
            alt="star"
            className="absolute w-[20px] top-28 left-28"
          />
          <img
            src={pinkStar}
            alt="star"
            className="absolute w-[20px] top-7 right-5"
          />
          {/*
                    <img src={pencil}
                        alt="pencil"
                        className=" object-cover"
                    /> */}
        </div>
        <p className="font-semibold  self-end mx-auto w-fit text-center mt-4">
          Create new board
        </p>
      </div>




      {/*  */}
    </div>
  );
};
