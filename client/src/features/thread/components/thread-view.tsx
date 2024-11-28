import { ReactionType, Thread } from "@/types";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { BiDislike } from "react-icons/bi";
import { IoMdHeart } from "react-icons/io";
import { MdInsertComment } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useCreateReaction } from "@/features/thread/api/create-reaction";
import { useGetUserReaction } from "../api/get-reaction";
import { useAuth } from "@/hooks/use-auth";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

interface ThreadViewProps {
  thread: Thread;
}

export const ThreadView = ({ thread }: ThreadViewProps) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { mutate: addReaction } = useCreateReaction({});
  const { data: reaction } = useGetUserReaction({
    data: { threadId: thread.id, userId: authState?.user?.id.toString() || "" },
  });

  const onSubmitReaction = (type: string) => {
    const data = {
      threadId: thread.id,
      userId: authState.user?.id.toString(),
      type: type,
    };
    addReaction(data);
  };

  const reactionFlag = (keyType: ReactionType) => {
    return reaction?.type === keyType;
  };

  const isOwner = thread.createdBy.id === authState.user?.id;

  return (
    <div className="bg-primary p-5 rounded-xl">
      <div className="mb-4 flex justify-between text-xl">
        <IoArrowBackOutline
          className="cursor-pointer text-accent"
          onClick={() => navigate("/")}
        />

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <BsThreeDots className="cursor-pointer text-accent" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex flex-col items-center bg-container mr-48 rounded-lg 
          text-base w-44 text-primary-foreground"
            >
              <DropdownMenuItem className="py-3 cursor-pointer hover:brightness-75">
                <p>Delete</p>
              </DropdownMenuItem>

              <DropdownMenuItem className="py-3 cursor-pointer hover:brightness-75">
                Update
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
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
            icon={
              <IoMdHeart
                className={clsx(
                  "transition-colors",
                  reactionFlag("LIKE") ? "text-accent" : "text-[#808080]",
                )}
              />
            }
            count={thread.likeCount}
            onClick={() => onSubmitReaction("LIKE")}
          />
          <Reaction
            icon={
              <BiDislike
                className={clsx(
                  "transition-colors",
                  reactionFlag("DISLIKE") ? "text-accent" : "text-[#808080]",
                )}
              />
            }
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
