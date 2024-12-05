import { ReactNode } from "react";
import { Navbar } from "../shared/navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  LeftSidebar?: React.ComponentType;
  RightSidebar?: React.ComponentType;
  children?: ReactNode;
  className?: string;
}

export const MainLayout = ({
  LeftSidebar,
  RightSidebar,
  children,
  className
}: LayoutProps) => {
  return (
    <div className="pt-[5rem]">
      <Navbar />

      <main
        className={cn(`z-10 bg-background flex-1 flex flex-col p-6 gap-6`, className)}
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        {LeftSidebar && <LeftSidebar />}

        <div style={{ minHeight: "calc(100vh - 8.5rem)" }}>{children}</div>

        {RightSidebar && <RightSidebar />}
      </main>
    </div>
  );
};
