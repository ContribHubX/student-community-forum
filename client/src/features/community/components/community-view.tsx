import { AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommunityWithMembers } from "@/types";

import { PiDotsThreeOutlineFill } from "react-icons/pi";

interface CommunityViewProps {
  community: CommunityWithMembers;
}

export const CommunityView = ({ community }: CommunityViewProps) => {
  return (
    <section
      className="h-[640px] w-full bg-primary rounded-b-2xl flex flex-col gap-4 items-center
        shadow-md"
    >
      <div className="w-[85%] relative ">
        <img src={community?.banner} className="h-[420px]" alt="" />
        <div className="absolute left-12 -bottom-14 flex gap-5">
          <img src={community?.icon} alt="" />
          <p className="text-3xl font-bold text-primary-foreground self-end mb-2">
            {community?.name}
          </p>
        </div>
      </div>

      <div className="pt-14 w-[85%] pl-14 h-[35%] flex flex-col gap-5">
        <div className="space-y-2 flex justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              {community?.members.length} members
            </p>
            <div className="flex">
              {community?.members.map((member, index) => {
                return (
                  <Avatar
                    key={index}
                    className={`${index !== 0 && "-translate-x-2"}`}
                  >
                    <AvatarImage src={member.user.attachment} height={5} />
                  </Avatar>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PiDotsThreeOutlineFill className="text-3xl text-primary-foreground" />
            <Button className="bg-accent text-accent-foreground px-8 font-light">
              Join
            </Button>
          </div>
        </div>

        <div className="flex flex-1 px-5 items-center gap-10 border-t-2 border-slate-700 border-opacity-50">
          <div
            className="px-2 h-full grid place-content-center cursor-pointer
              border-b-2 border-accent"
          >
            Threads
          </div>
          <div className="h-full grid place-content-center cursor-pointer">
            Events
          </div>
        </div>
      </div>
    </section>
  );
};