import { Thread } from "@/types";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ThreadCardProp {
  thread: Thread;
}

export const ThreadCard = ({ thread }: ThreadCardProp) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleCardClick = () => {
    navigate(`/thread/${thread.id}`);
  };
  
  return (
    <div
      className="w-full bg-primary rounded-xl p-5 flex gap-5 relative flex-col cursor-pointer
    xl:flex-row shadow-slate-400 shadow-md dark:shadow-gray-900"
      onClick={handleCardClick}
    >
      <div
        className={`absolute top-5 right-5 bg-[#EFF5F8] h-8 w-8 cursor-pointer
          rounded-full grid place-content-center ${isLiked ? "text-accent" : "text-[#E0E0E0]"}`}
        onClick={() => setIsLiked(!isLiked)}
      >
        <FaHeart className="text-lg" />
      </div>

      <img
        className=" rounded-xl flex-shrink-0 w-full mt-10
            xl:w-[200px] xl:mt-0"
        src="https://media.sproutsocial.com/uploads/2017/01/Instagram-Post-Ideas.png"
        alt=""
      />

      <div className="w-full gap-10 flex flex-col">
        <div className="space-y-4 text-xl">
          <p>{thread.title}</p>
          <div className="flex gap-2 text-xs text-accent-foreground font-light">
            {/* tags */}
            <div className="bg-accent py-2 px-3 rounded-2xl">finance</div>
            <div className="bg-accent py-2 px-3 rounded-2xl">finance</div>
            <div className="bg-accent py-2 px-3 rounded-2xl">finance</div>
          </div>
        </div>

        <div className="w-full flex text-[#808080] items-center font-light justify-between">
          <div className="flex gap-2 text-sm">
            <div className="h-10 w-10 rounded-full border border-black flex-shrink-0"></div>
            <div className="">
              <p className="text-primary-foreground">Pavel Gray</p>
              <p className="font-light text-xs">3 Weeks ago</p>
            </div>
          </div>

          <div className="flex gap-3 text-sm">
            <p className="cursor-pointer">652,324 views</p>

            <p className="cursor-pointer">36,654 likes</p>

            <p className="cursor-pointer">56 comments</p>
          </div>
        </div>
      </div>
    </div>
  );
};
