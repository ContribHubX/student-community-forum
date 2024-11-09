import { Navbar } from "@/components/shared/navbar";
import { PropsWithChildren } from "react";

export const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>

      <main className="bg-background h-screen">{children}</main>
    </div>
  );
};
