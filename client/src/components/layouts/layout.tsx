import { ReactNode } from "react";
import { Navbar } from "../shared/navbar";
import { cn } from "@/lib/utils";

import { IoIosArrowDropright } from "react-icons/io";
import { useDisclosure } from "@/hooks/use-disclosure";

interface LayoutProps {
  LeftSidebar?: React.ComponentType;
  RightSidebar?: React.ComponentType;
  children?: ReactNode;
  className?: string;
  contentStyle?: string;
}

export const MainLayout = ({
  LeftSidebar,
  RightSidebar,
  children,
  className,
  contentStyle
}: LayoutProps) => {
  const { isOpen, toggle } = useDisclosure();

  return (
    <div className="pt-[5rem]">
      <Navbar />

      <div className="fixed left-0 md:hidden"> 
        <IoIosArrowDropright 
          onClick={toggle}
        />
      </div>

      <main
        className={cn(
          `z-10 bg-background flex flex-row p-3 sm:p-6 gap-6 max-w-[1536px] mx-auto`,
          className,
        )}
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className={`fixed ${isOpen ? 'translate-x-0' : '-translate-x-[200%]'} md:translate-x-0`}>
          {LeftSidebar && <LeftSidebar />}
        </div>

        <div 
          className={cn(`w-full
              md:ml-[15.5rem] 
              lg:mr-[17.5rem]
              xl:mr-[19.5rem]`, contentStyle)}
          style={{ minHeight: "calc(100vh - 8.5rem)" }}
        >
          {children}
        </div>

        <div className="fixed right-4">
          {RightSidebar && <RightSidebar />}
        </div>
      </main>
    </div>
  );
};
