import { ThemeToggle } from "../ui/theme-toggle";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { NotificationDropdown } from "@/features/notification/components/notication-dropdown";
import { IoSearch } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdDashboard, MdCreate } from "react-icons/md";
import { useState } from "react";
import { CommunityForm } from "@/features/community/components/communit-form";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

export const Navbar = () => {
  const { authState } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCommunityFormModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <nav
      className="fixed top-0 bg-primary px-10 py-4 flex items-center justify-between w-full z-50
    text-primary-foreground "
    >
      <div>LOGO</div>
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

          {/* dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-2xl">
                <MdDashboard className="text-3xl" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56  bg-primary dark:bg-background dark:border-muted-foreground">
              <DropdownMenuLabel>Create</DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-muted-foreground" />
              <DropdownMenuItem onClick={() => {}}>
                <MdCreate className="mr-2 h-4 w-4" />
                <span>Thread</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCommunityFormModal}>
                <MdCreate className="mr-2 h-4 w-4" />
                <span>Community</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NotificationDropdown userId={authState.user?.id || ""} />
          <div className="cursor-pointer">
            <Avatar className="p-[4px] bg-accent">
              <AvatarImage
                src={authState.user?.attachment}
                className="rounded-full "
              />
            </Avatar>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCommunityFormModal}
          className="w-[800px] max-h-[600px] flex flex-col"
        >
          <CommunityForm
            userId={authState.user?.id || ""}
            handleCommunityModal={handleCommunityFormModal}
          />
          {/* <button onClick={handleCommunityFormModal}>Back</button> */}
        </Modal>

      </div>
    </nav>
  );
};
