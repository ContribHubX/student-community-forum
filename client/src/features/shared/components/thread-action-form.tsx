import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Community, User } from "@/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ThreadActionFormProp {
  user: User;
  community?: Community;
}

export const ThreadActionForm = ({ user, community }: ThreadActionFormProp) => {
  const navigate = useNavigate();
  const [route, setRoute] = useState("create");

  useEffect(() => {
    if (!community) return;

    setRoute(community?.id ? `create_${community?.id}` : "create");
  }, [community]);

  return (
    <div className="flex p-3 sm:p-4 gap-2 md:gap-4 rounded-xl bg-primary  shadow-slate-400 shadow-md dark:shadow-gray-900">
      <div className="w-full flex gap-2 sm:gap-4 items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.attachment} className="rounded-full " />
        </Avatar>
        <input
          readOnly
          className="h-full text-sm w-full font-light px-5 bg-background text-primary-foreground rounded-md
            outline-none focus:border-red-600"
          placeholder="Lets share what's going on your mind.."
          onClick={() => navigate(`/thread-action/${route}`)}
        />
      </div>
      <button
        onClick={() => navigate(`/thread-action/${route}`)}
        type="submit"
        className="shrink-0 bg-accent text-accent-foreground px-2 xs:px-3 sm:py-3 sm:px-4  text-xs xs:text-sm rounded-md  xs:block"
      >
        Create
      </button>
    </div>
  );
};
