import { useState, useEffect } from "react";

import { motion } from "framer-motion";

import { CommunityTab, CommunityWithMembers } from "@/types";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

import { AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { users } from "@/features/shared/data/users";
import { useJoinCommunity } from "../api/join-community";

interface CommunityViewProps {
  community: CommunityWithMembers;
  userId: string;
  onTabChange: (tab: CommunityTab) => void;
  tabOpen: CommunityTab;
  isJoined: boolean;
}

export const CommunityView = ({
  community,
  userId,
  onTabChange,
  tabOpen,
  isJoined
}: CommunityViewProps) => {
  const [scrollY, setScrollY] = useState(0);
  const { mutate: joinCommunity } = useJoinCommunity({});

 
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative mx-auto overflow-hidden rounded-b-[40px] shadow-lg">
      <motion.div
        className="h-[640px] bg-gradient-to-b from-primary to-primary/80 rounded-b-[40px] flex flex-col items-center shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-[480px] relative overflow-hidden">
          <motion.img
            src={community?.banner}
            className="w-full h-full object-cover"
            alt="banner"
            style={{
              scale: 1 + scrollY * 0.001,
              translateY: scrollY * 0.5,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
        </div>

        <motion.div
          className="absolute w-full px-4 md:px-0 md:w-[86%] mx-auto  bottom-40 flex items-end gap-6 z-10  max-w-[1400px]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
            <AvatarImage src={community?.icon} alt="Community icon" />
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">
              {community?.name}
            </h1>
            <p className="text-background/80 text-lg">
              {community?.members.length} members
            </p>
          </div>
        </motion.div>

        <div className="md:px-8 mt-24 w-full px-4  md:w-[86%] max-w-[1400px]">
          <div className="flex justify-between items-center">
            <div className="flex -space-x-3">
              {users.slice(0, 5).map((member, index) => (
                <Avatar
                  key={index}
                  className="h-12 w-12 border-2 border-background transition-transform hover:scale-110"
                >
                  <AvatarImage
                    src={member.attachment}
                    className="rounded-full object-cover"
                  />
                </Avatar>
              ))}
              {users.length > 5 && (
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium border-2 border-background">
                  +{users.length - 5}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <PiDotsThreeOutlineFill className="text-2xl" />
              </Button>
              <Button
                className={`bg-accent text-accent-foreground px-8 py-2 rounded-full  font-medium hover:bg-accent/90 transition-colors
                            ${isJoined && "dark:bg-primary text-primary-foreground dark:border-background bg-background border-2 border-accent"}  
                `}
                onClick={() =>
                  joinCommunity({
                    communityId: community.id,
                    userId: userId.toString(),
                  })
                }
              >
                {!isJoined ? "Join" : "Joined"}
              </Button>
            </div>
          </div>

          <nav className="mt-8 flex gap-8  border-primary-foreground/10">
            {["Threads", "Events", "Members", "Media"].map((item) => (
              <Button
                key={item}
                variant="ghost"
                className={`text-primary-foreground/70 hover:text-accent-foreground pb-4 px-2 rounded-none text-sm  ${
                  tabOpen === item
                    ? "border-b-2 border-accent text-primary-foreground"
                    : ""
                }`}
                onClick={() => onTabChange(item as CommunityTab)}
              >
                {item}
              </Button>
            ))}
          </nav>
        </div>
      </motion.div>
    </section>
  );
};
