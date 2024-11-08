import { ThemeToggle } from "../ui/theme-toggle";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export const Navbar = () => {
  const { authState } = useAuth();

  return (
    <nav className="bg-primary px-3 py-3 flex items-center justify-between">
      <div>{/* logo here */}</div>

      <div>{/* search field */}</div>

      <div className="flex iterms-center gap-4">
        <div className="flex gap-2">
          <ThemeToggle />
          <div className="h-10 w-10 rounded-full bg-red-600">{/* Profile */}</div>
        </div>
        
        <div>
        
        </div>
        <div>
          <Avatar
            className="p-[4px] bg-accent"
          >
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
