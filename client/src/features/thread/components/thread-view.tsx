import { Thread } from "@/types";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { BiDislike } from "react-icons/bi";
import { IoMdHeart } from "react-icons/io";
import { MdInsertComment } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useCreateReaction } from "@/features/thread/api/create-reaction";
import { useAuth } from "@/hooks/use-auth";

interface ThreadViewProps {
  thread: Thread;
}

export const ThreadView = ({ thread }: ThreadViewProps) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { mutate: addReaction } = useCreateReaction({});

  const onSubmitReaction = (type: string) => {
    const data = {
      threadId: thread.id,
      userId: authState.user?.id,
      type: type,
    };
    addReaction(data);
  };

  return (
    <div className="bg-primary p-5 rounded-xl">
      <IoArrowBackOutline
        className="mb-4 text-xl text-accent cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="space-y-6">
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
          <div className="text-muted-foreground">
            <p dangerouslySetInnerHTML={{ __html: thread?.content }}></p>
          </div>
        </div>

        <div className="flex gap-6">
          <Reaction
            icon={<IoMdHeart className="text-accent" />}
            count={thread.likeCount}
            onClick={() => onSubmitReaction("LIKE")}
          />
          <Reaction
            icon={<BiDislike />}
            count={thread.dislikeCount}
            onClick={() => onSubmitReaction("DISLIKE")}
          />
          <Reaction icon={<MdInsertComment />} count={325} />
        </div>
      </div>
    </div>
  );
};

interface ReactionProps {
  count: number;
  icon: JSX.Element;
  onClick?: (data: any) => void;
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