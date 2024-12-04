import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

import { PiMicrophoneSlashLight } from "react-icons/pi";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { HiOutlinePlus } from "react-icons/hi";

interface UsersPanelProp {
  users: User[];
}

// TODO implement user invite

export const UsersPanel = ({ users }: UsersPanelProp) => {
  return (
    <div
      className="p-3 md:bg-background rounded-2xl 
         md:h-[98vh] flex md:flex-col justify-between md:justify-normal"
    >
      <div className={`flex items-center gap-5 
          md:flex-col
          md:flex-1
      `}>
        {users.slice(0, 5).map((user) => (
          <UserTab key={user.id} user={user} />
        ))}
        <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-primary">
          <HiOutlinePlus className="text-[2rem] font-thin text-accent-foreground" />
        </div>
      </div>
      <div className="">
        <img
          src="https://pbs.twimg.com/media/FL5DEjrXIAcXBzi?format=jpg&name=small"
          className="max-w-[80px] rounded-2xl"
        />
      </div>
    </div>
  );
};

interface UserTabProp {
  user: User;
}

const UserTab = ({ user }: UserTabProp) => {
  return (
    <div className="relative">
      <div className="rounded-full p-[.2rem] bg-red-400 w-fit text-accent-foreground absolute z-50 bottom-0">
        <PiMicrophoneSlashLight className="text-lg" />
      </div>
      <Avatar className="w-[70px] h-[70px]">
        <AvatarImage src={user.attachment} className="object-cover" />
        <AvatarFallback />
      </Avatar>
      <div className="p-[.2rem] w-fit rounded-full bg-[#50373b] text-accent-foreground absolute z-50 bottom-0 -right-1">
        <IoEllipsisHorizontalSharp className="text-lg" />
      </div>
    </div>
  );
};
