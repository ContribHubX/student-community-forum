import React, { useState, useEffect, useRef } from "react";
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
} from "@/components/ui/dropdown-menu";
import { MdDashboard, MdCreate } from "react-icons/md";
import { CommunityForm } from "@/features/community/components/communit-form";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { CgProfile, CgLogOut } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { OPERATION } from "@/providers/auth/context";
import { useGetThreads } from "@/features/thread/api/get-all-threads";
import { ThreadSearchResults } from "../ui/search-result";
import { useDebounce } from "@/hooks/use-debounce";
import { Thread } from "@/types";

import { Logo } from "../ui/logo";


export const Navbar = () => {
  const { authState, authDispatch } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { data: threads } = useGetThreads({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Thread[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleCommunityFormModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      const results = threads?.filter((thread) =>
        thread?.tags?.some((tag) =>
          tag.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
        ),
      );
      setSearchResults(results || []);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, threads]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 bg-primary px-6   py-4 flex items-center justify-between  w-full z-50 text-primary-foreground">
      <div className="flex items-center justify-center gap-3">
        <Logo className="w-6 h-6 text-accent" />
        <h1 className="font-medium text-lg hidden sm:block">StudentHub</h1>
      </div>
      <div className="flex items-center gap-6 ">
        <div
          className="bg-background rounded-xl py-2 pl-4 pr-1 relative items-center justify-between gap-2 hidden md:flex"
          ref={searchRef}
        >
          <input
            type="text"
            className="bg-background outline-none text-sm font-light text-primary-foreground md:w-[300px] lg:w-[500px]"
            placeholder="Search threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="bg-primary p-2 text-primary-foreground rounded-md shadow-xl">
            <IoSearch />
          </div>
          {(isSearching || searchResults.length > 0) && (
            <ThreadSearchResults
              results={searchResults}
              onSelectThread={() => setSearchResults([])}
            />
          )}
        </div>

        <div className="flex items-center gap-2  md:gap-4">
          <div className="flex gap-2">
            <ThemeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-2xl">
                <MdDashboard className="text-3xl" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-primary dark:bg-background dark:border-muted-foreground">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <Avatar className="p-[4px] bg-accent">
                  <AvatarImage
                    src={authState.user?.attachment}
                    className="rounded-full"
                  />
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20 bg-primary dark:bg-background dark:border-gray-600">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <CgProfile className="mr-0 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  authDispatch({
                    type: OPERATION.LOGOUT_USER,
                    payload: null,
                  });
                }}
              >
                <CgLogOut className="mr-0 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCommunityFormModal}
          className="w-[800px] max-h-[600px] flex flex-col"
        >
          <CommunityForm
            userId={authState.user?.id || ""}
            handleCommunityModal={handleCommunityFormModal}
          />
        </Modal>
      </div>
    </nav>
  );
};
