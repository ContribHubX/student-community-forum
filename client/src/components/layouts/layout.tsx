import { PropsWithChildren } from "react";
import { Navbar } from "../shared/navbar";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>

      <main className="bg-background h-screen">{children}</main>
    </div>
  );
};
