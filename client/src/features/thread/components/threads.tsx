
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

import { ThreadCardList } from "@/features/shared/components/thread-card-list";

import { useAuth } from "@/hooks/use-auth";
import { useGetThreads } from "../api/get-all-threads";

export const Threads = () => {
  const { authState } = useAuth();

  const { data: threads } = useGetThreads({});
  const navigate = useNavigate();

  if (!authState.user) return <p>Loading...</p>

  return (
    <div>
      <div className="flex p-6 gap-6 rounded-xl bg-primary relative mb-6 shadow-slate-400 shadow-md dark:shadow-gray-900">
        <div className="w-full flex gap-4 items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={authState.user?.attachment}
              className="rounded-full "
            />
          </Avatar>
          <input
            readOnly
            className="h-full text-sm w-full font-light px-5 bg-background text-primary-foreground rounded-md
            outline-none focus:border-red-600"
            placeholder="Lets share what's going on your mind.."
            onClick={() => navigate("/thread-action/create")}
          />
        </div>
        <button
          onClick={() => navigate("/thread-action/create")}
          type="submit"
          className="shrink-0 bg-accent text-accent-foreground py-3 px-4 text-sm rounded-md "
        >
          Create Thread
        </button>
      </div>


      <div>
        <ThreadCardList threads={threads || []} />
      </div>
    </div>
  );
};
