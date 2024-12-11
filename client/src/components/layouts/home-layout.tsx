import { Navbar } from "@/components/shared/navbar";
import { PropsWithChildren } from "react";

export const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>

      <main className="bg-background h-screen mt-24 px-2 md:px-4 max-w-[1536px] mx-auto">
        {children}
      </main>
    </div>
  );
};
