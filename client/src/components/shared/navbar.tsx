import { ThemeToggle } from "../ui/theme-toggle";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { IoMdNotifications } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useGetNotification } from "@/features/user/api/get-notifications";
import { MdDashboard } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { MdCreate } from "react-icons/md";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { CommunityForm } from "@/features/community/components/community-form";

export const Navbar = () => {
  const { authState } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: notification } = useGetNotification({
    userId: authState.user?.id,
  });

  if (!authState.user || !authState) {
    return;
  }
  console.log(notification);
  const handleCommunityFormModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <nav
      className="fixed top-0 bg-primary px-10 py-4 flex items-center justify-between w-full z-10
    text-primary-foreground "
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

          <DropdownMenu>
            <DropdownMenuTrigger>
              <MdDashboard className="text-2xl text-primary-foreground cursor-pointer" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="bg-container mt-5 rounded-xl w-52 p-4 space-y-4 font-light
            mr-32 shadow-slate-400 shadow-md dark:shadow-gray-900"
            >
              <h1 className="font-medium text-lg items-center">Create</h1>

              <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                <div className="h-9 w-9 rounded-full bg-background grid place-content-center">
                  <MdCreate className="text-lg" />
                </div>
                <p className="text-sm">Thread</p>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex gap-2 items-center cursor-pointer"
                onClick={handleCommunityFormModal}
              >
                <div className="h-9 w-9 rounded-full bg-background grid place-content-center">
                  <MdCreate className="text-lg" />
                </div>
                <p className="text-sm">Community</p>
              </DropdownMenuItem>

              {/*
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>

          <IoMdNotifications className="text-2xl text-primary-foreground cursor-pointer" />
          <div className="cursor-pointer">
            <Avatar className="p-[4px] bg-accent">
              <AvatarImage
                src={authState.user.attachment}
                className="rounded-full"
              />
            </Avatar>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCommunityFormModal}
          className="w-[800px] max-h-[600px] flex flex-col"
          isExit
        >
          <CommunityForm
            userId={authState.user?.id}
            handleCommunityModal={handleCommunityFormModal}
          />
          {/* <button onClick={handleCommunityFormModal}>Back</button> */}
        </Modal>
        {/*
        if not logged in
        <div className="bg-accent px-10 flex items-center justify-center rounded-md cursor-pointer text-accent-foreground">
          Login
        </div> */}
      </div>
    </nav>
  );
};
