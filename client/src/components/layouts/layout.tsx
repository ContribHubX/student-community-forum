import { PropsWithChildren } from "react";
import { Navbar } from "../shared/navbar";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { RightSidebar } from "@/components/shared/right-sidebar";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="pt-[5.5rem]">
      <Navbar />

      <main
        className="bg-background flex-1 flex flex-col p-6 gap-6"
        style={{ minHeight: "calc(100vh - 5.5rem)" }}
      >
        <LeftSidebar />

        <div
          className="bg-background border-3 border-black
        md:mr-[17.5rem] lg:mx-[17.5rem]
        "
        >
          {children}
        </div>

        <RightSidebar />
      </main>
    </div>
  );
};
