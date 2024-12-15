import { ReactNode } from "react";
import { Navbar } from "../shared/navbar";
import { cn } from "@/lib/utils";
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
  contentStyle,
}: LayoutProps) => {
  const { isOpen, toggle } = useDisclosure();

  return (
    <div className="pt-[5rem]">
      <Navbar 
        toggleSidebar={toggle}
      />
      <main
        className={cn(
          `z-10 bg-background flex flex-row p-3 sm:p-6 gap-0 md:gap-6  max-w-[1536px] mx-auto`,
          className,
        )}
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-50 z-40  transform overflow-y-auto bg-background md:p-2 transition-transform duration-300 ease-in-out md:translate-x-0",
            isOpen ? "translate-x-0 top-16" : "-translate-x-full top-20"
          )}
        >
          {LeftSidebar && <LeftSidebar />}
        </div>

        <div
          className={cn(
            `w-full
             md:ml-[16rem]
             ${RightSidebar === undefined ? "md:mr-[16rem]" : ""}
            `,
            contentStyle,
          )}
          style={{ minHeight: "calc(100vh - 8.5rem)" }}
        >
          {children}
        </div>

        {/* <div className="fixed right-4">{RightSidebar && <RightSidebar />}</div> */}
        <div className="hidden md:block">{RightSidebar && <RightSidebar />}</div>
      </main>
    </div>
  );
};

