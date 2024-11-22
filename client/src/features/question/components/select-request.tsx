import { IoIosSearch } from "react-icons/io";
import { BiSend } from "react-icons/bi";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

import { useGetUsers } from "@/features/shared/api/get-all-users";
import { useCreateRequest } from "../api/create-request";

interface SelectRequestProp {
  questionId: string;
  currentUserId: string;
}

export const SelectRequest = ({
  questionId,
  currentUserId,
}: SelectRequestProp) => {
  const { data: users } = useGetUsers({});
  const { mutate: createRequest } = useCreateRequest({});

  const handleCreate = (selectedUser: User) => {
    createRequest({
      questionId,
      requestedBy: currentUserId,
      requestedTo: selectedUser.id,
    });
  };

  return (
    <div>
      <div className="relative">
        <IoIosSearch className="text-xl text-muted-foreground mt-3 left-3 absolute" />
        <input
          type="text"
          placeholder="Search for people"
          className="text-sm py-3 px-4 rounded-md  pl-9 focus:outline-accent w-full bg-background"
        />
      </div>

      <div className="min-h-[300px] flex flex-col gap-3 mt-6">
        {users?.map((user) => (
          <UserItem key={user.id} user={user} handleClick={handleCreate} />
        ))}
      </div>
    </div>
  );
};

interface UserItemProp {
  user: User;
  handleClick: (user: User) => void;
}

const UserItem = ({ user, handleClick }: UserItemProp) => {
  return (
    <div className="flex items-center justify-between px-4 hover:bg-background py-2 rounded-md">
      <div className="flex items-center gap-4">
        <Avatar className="w-[50px] h-[50px]">
          <AvatarImage src={user.attachment} />
        </Avatar>

        <div className="flex flex-col">
          <p>{user.name}</p>
          <small className="text-muted-foreground">{user.email}</small>
        </div>
      </div>

      <BiSend
        className="text-xl cursor-pointer hover:text-accent"
        onClick={() => handleClick(user)}
      />
    </div>
  );
};
