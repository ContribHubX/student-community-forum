import { ReactNode } from "react";
import { Navbar } from "../shared/navbar";
import { IoIosArrowDropright } from "react-icons/io";
import { useDisclosure } from "@/hooks/use-disclosure";


interface LayoutProps {
  LeftSidebar?: React.ComponentType;
  RightSidebar?: React.ComponentType;
  children?: ReactNode;
}

export const PopularLayout = ({ LeftSidebar, children }: LayoutProps) => {
  const { isOpen, toggle } = useDisclosure();

  return (
    <div className="pt-[5rem] overflow-x-hidden">
       <Navbar />

      <div className="fixed left-0 md:hidden"> 
        <IoIosArrowDropright 
          onClick={toggle}
        />
      </div>

        <main
          className="z-10 bg-background flex-1 flex sm:p-6 gap-6 max-w-[1536px] mx-auto p-3"
          style={{ minHeight: "calc(100vh - 4rem)" }}
        >
          <div className={`fixed ${isOpen ? 'translate-x-0' : '-translate-x-[200%]'} md:translate-x-0`}>
            {LeftSidebar && <LeftSidebar />}
          </div>

          <div style={{ minHeight: "calc(100vh - 8.5rem)" }}>{children}</div>

          {/* {RightSidebar && <RightSidebar />} */}
        </main>
      {/* </PageTransition> */}
    </div>
  );
};
