import { ThemeToggle } from "../ui/theme-toggle";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { IoMdNotifications } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

export const Navbar = () => {
  const { authState } = useAuth();

  return (
    <nav
      className="fixed top-0 bg-primary px-10 py-5 flex items-center justify-between w-full z-[999]
    text-primary-foreground"
    >
      <div>LOGO</div> {/* logo */}
      <div className="flex gap-20">
        <div className="bg-background  rounded-xl py-2 pl-4 pr-1 flex relative items-center justify-between gap-2">
          <input
            type="text"
            className="bg-background outline-none text-sm font-light"
            placeholder="Type to search"
          />

          <div className="bg-primary p-2 text-primary-foreground rounded-md shadow-xl">
            <IoSearch />
          </div>
        </div>

        <div className="flex items-center gap-4 justify-items-center">
          <div className="flex gap-2">
            <ThemeToggle />
          </div>

          <IoMdNotifications className="text-2xl text-primary-foreground cursor-pointer" />
          <div className="cursor-pointer">
            <Avatar className="p-[4px] bg-accent">
              <AvatarImage
                src={authState.user?.attachment}
                className="rounded-full "
              />
            </Avatar>
          </div>
        </div>

        {/*
        if not logged in
        <div className="bg-accent px-10 flex items-center justify-center rounded-md cursor-pointer text-accent-foreground">
          Login
        </div> */}
      </div>
    </nav>
  );
};
