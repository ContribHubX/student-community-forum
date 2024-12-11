import { Button } from "@/components/ui/button";
import { Community } from "@/types";
import { Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommunityCardProps {
  community: Community;
  rank: number;
}

export function CommunityCard({ community, rank }: CommunityCardProps) {
  const isJoined = false;
  const navigate = useNavigate();

  return (
    <div className="flex items-center hover:text-accent-foreground text-primary-foreground space-x-4 p-4 bg-background hover:bg-accent transition-colors rounded-lg">
      <div className="relative flex-shrink-0">
        <img
          src={community.icon}
          alt={community.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {rank}
        </div>
      </div>
      <div
        className="flex-grow cursor-pointer"
        onClick={() => navigate(`/community/${community.id}`)}
      >
        <h3 className="font-semibold text-lg">{community.name}</h3>
        <p className="text-muted-foreground text-sm flex items-center">
          <Users size={14} className="mr-1" />
          99 members
        </p>
        <p className="text-sm line-clamp-1 mt-1">{community.description}</p>
      </div>
      <div className="flex-shrink-0 flex items-center space-x-2 ">
        <Button
          variant={isJoined ? "outline" : "default"}
          size="sm"
          className="text-accent-foreground"
        >
          {isJoined ? "Leave" : "Join"}
        </Button>
        <ChevronRight className="text-muted-foreground" />
      </div>
    </div>
  );
}
