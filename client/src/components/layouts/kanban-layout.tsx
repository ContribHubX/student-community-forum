import { ReactNode } from "react";
import { Navbar } from "../shared/navbar";

interface LayoutProps {
  children?: ReactNode;
  hideNavbar?: boolean; // Prop to control visibility
}

export const KanbanLayout = ({ children, hideNavbar }: LayoutProps) => {
  return (
    <div className={`pt-${hideNavbar ? "[0]" : "[5rem]"}`}>
      {!hideNavbar && <Navbar />}
      <main
        className="z-10 bg-background flex-1 flex flex-col p-6 gap-6"
        style={{ minHeight: hideNavbar ? "100vh" : "calc(100vh - 4rem)" }}
      >
        <div style={{ minHeight: hideNavbar ? "100vh" : "calc(100vh - 8.5rem)" }}>
          {children}
        </div>
      </main>
    </div>
  );
};
