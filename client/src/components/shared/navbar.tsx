import { ThemeToggle } from "../ui/theme-toggle";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { IoMdNotifications } from "react-icons/io";

export const Navbar = () => {
  const { authState } = useAuth();

  return (
    <nav className="fixed top-0 bg-primary px-10 py-5 flex items-center justify-between w-full z-[999]">
      <div>LOGO</div> {/* logo */}
      <div>
        <input type="text" className="bg-red-700" />
      </div>
      <div className="flex items-center gap-4 justify-items-center">
        <div className="flex gap-2">
          <ThemeToggle />
        </div>

        <IoMdNotifications className="text-2xl text-primary-foreground" />
        <div>
          <Avatar className="p-[4px] bg-accent">
            <AvatarImage
              src={authState.user?.attachment}
              className="rounded-full "
            />
          </Avatar>
        </div>
      </div>
    </nav>
  );
};
