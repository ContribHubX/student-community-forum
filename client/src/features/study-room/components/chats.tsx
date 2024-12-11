import { useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";

import { TbSend2 } from "react-icons/tb";

import { chats } from "../data/chats";
import { User } from "@/types";
import { useGetChats } from "../api/get-chats";
import { useCreateChat } from "../api/create-chat";

interface ChatsProp {
  userId: string;
  roomId: string;
}

export const Chats = ({ userId, roomId }: ChatsProp) => {
  //const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
  const { data: chatsData } = useGetChats({ roomId: roomId || "" });
  const { mutate: createChat } = useCreateChat({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCreateChat = (message: string) => {
    createChat({
      type: "message",
      message,
      roomId,
      createdBy: userId.toString(),
    });
  };

  useEffect(() => {
    if (!bottomRef.current) return;

    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatsData]);

  useEffect(() => {
    if (!roomId || !userId) return;

    createChat({
      type: "indicator",
      message: "",
      roomId,
      createdBy: userId.toString(),
    });
  }, [roomId, userId]);

  return (
    <div
      className="sm:col-span-2 md:col-span-1 text-sm rounded-2xl bg-primary md:max-w-[261px] shadow-xl flex-1 flex flex-col"
      style={{
        minHeight: "calc(100% - 80%)",
      }}
    >
      <div className="bg-[#bd8322] p-3 text-accent-foreground rounded-t-2xl">
        <Select>
          <SelectTrigger className="text-[.8rem] max-w-[60px] p-0 flex font-medium bg-transparent border-0 px-0 h-4">
            <SelectValue placeholder="Chats" />
          </SelectTrigger>
          <SelectContent className="border-0 ">
            <SelectItem value="group">Group Task</SelectItem>
            <SelectItem value="personl">My Task</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea
        className="pb-2 text-accent-foreground text-[.8rem] flex-1"
        // style={{
        //     height: `calc(100% - ${isFirefox ? "29%" : "28%"})`
        // }}
      >
        <div className="flex flex-col gap-2">
          {[...chats, ...chatsData || []]?.map((chat) => (
            <div key={chat.id}>
              {chat.type === "indicator" ? (
                <Indicator user={chat.createdBy} />
              ) : (
                <Message user={chat.createdBy} message={chat.message} />
              )}
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </ScrollArea>

      <div className="p-2 ">
        <ChatForm handleSubmit={handleCreateChat} />
      </div>
    </div>
  );
};

interface ChatFormProp {
  handleSubmit: (message: string) => void;
}

const ChatForm = ({ handleSubmit }: ChatFormProp) => {
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(message);
    setMessage("");
  };

  return (
    <form
      className="flex items-center text-[.8rem] text-accent-foreground px-3 py-2 border-[1px] border-[#bd8322] bg-[#50373b] rounded-md"
      onSubmit={onSubmit}
    >
      <input
        type="text"
        placeholder="Say something..."
        value={message}
        className="border-0 outline-none bg-transparent w-full"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <TbSend2
        className="text-xl text-accent-foreground cursor-pointer"
        onClick={() => {
          handleSubmit(message);
          setMessage("");
        }}
      />
    </form>
  );
};

interface IndicatorProp {
  user: User;
}

const Indicator = ({ user }: IndicatorProp) => {
  return (
    <div className="px-2 py-1 bg-[#50373b] border-l-4 border-[#bd8322]">
      <p>{user.name} joined the room</p>
    </div>
  );
};

interface MessageProp {
  user: User;
  message: string;
}

const Message = ({ user, message }: MessageProp) => {
  return (
    <div className="flex flex-col  gap-2 px-3 ">
      <div className="flex items-center gap-2">
        <Avatar className="w-[30px] h-[30px]">
          <AvatarImage src={user.attachment} />
          <AvatarFallback />
        </Avatar>
        <p>{user.name}</p>
      </div>
      <p>{message}</p>
    </div>
  );
};
