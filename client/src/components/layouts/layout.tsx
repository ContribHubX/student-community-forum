import { ReactNode } from "react";
import { Navbar } from "../shared/navbar";

interface LayoutProps {
  LeftSidebar?: React.ComponentType;
  RightSidebar?: React.ComponentType;
  children?: ReactNode;
}

export const MainLayout = ({
  LeftSidebar,
  RightSidebar,
  children,
}: LayoutProps) => {
  return (
    <div className="pt-[5.5rem]">
      <Navbar />

      <main
        className="bg-background flex-1 flex flex-col p-6 gap-6"
        style={{ minHeight: "calc(100vh - 5.5rem)" }}
      >
        {LeftSidebar && <LeftSidebar />}

        {children}

        {RightSidebar && <RightSidebar />}
      </main>
    </div>
  );
};
