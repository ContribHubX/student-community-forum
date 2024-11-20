import { Community } from "@/types"
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface CommunityCardProp {
    community: Community;
    rank: number;
}


export const CommunityCard = ({ community, rank }: CommunityCardProp) => {
    
  return (
    <div className="flex items-center gap-3 cursor-pointer">
        <p className="mr-6 text-xs">{rank}</p>

        <Avatar className="w-[40px] h-[40px] rounded-full">    
            <AvatarImage 
                src={community.icon} 
                className="rounded-full object-cover"
            />
        </Avatar>

        <div className="text-sm">
            <p className="">c/machinelearning</p>
            <p className="text-xs">Learning And Education</p>
            <p className="text-muted-foreground text-xs">20M members</p>
        </div>

    </div>
  )
}
