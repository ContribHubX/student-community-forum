import { PropsWithChildren } from "react";
import { Navbar } from "../shared/navbar";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { RightSidebar } from "@/components/shared/right-sidebar";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="py-20">
      <Navbar />

      <main className="flex flex-col bg-background p-6 gap-6">
        <LeftSidebar />

        <div
          className="
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
