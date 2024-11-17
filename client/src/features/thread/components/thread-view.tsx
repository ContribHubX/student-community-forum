import { Thread } from "@/types";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { BiDislike } from "react-icons/bi";
import { IoMdHeart } from "react-icons/io";
import { MdInsertComment } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface ThreadViewProps {
  thread: Thread;
}

export const ThreadView = ({ thread }: ThreadViewProps) => {
  const navigate = useNavigate();

  console.log(thread);

  return (
    <div className="bg-primary p-5 rounded-xl">
      <IoArrowBackOutline
        className="mb-4 text-xl text-accent cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Avatar className="">
            <AvatarImage
              src={thread?.createdBy?.attachment}
              className="rounded-full h-10"
            />
          </Avatar>
          <div>
            <p className="text-primary-foreground">{thread?.createdBy.name}</p>
            <p>{thread?.createdBy.createdAt?.toDateString()}</p>
            <p className="text-muted-foreground text-xs">18 hours ago</p>
          </div>
        </div>

        <div className="">
          <h1 className="text-base text-primary-foreground">{thread?.title}</h1>
          <div
            className="ql-editor text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: thread?.content }}
          />
        </div>

        <div className="flex gap-6">
          <Reaction icon={<IoMdHeart className="text-accent" />} count={325} />
          <Reaction icon={<BiDislike />} count={57} />
          <Reaction icon={<MdInsertComment />} count={325} />
        </div>
      </div>
    </div>
  );
};

interface ReactionProps {
  count: number;
  icon: JSX.Element;
  onClick?: () => void;
}

const Reaction = ({ count, icon, onClick }: ReactionProps) => {
  return (
    <div
      className="cursor-pointer flex items-center gap-1 text-[#808080] text-base"
      onClick={onClick}
    >
      <div className="border border-[#505050] px-4 py-2 rounded-[40px]">
        {icon}
      </div>

      <p className="font-light text-sm">{count}</p>
    </div>
  );
};
