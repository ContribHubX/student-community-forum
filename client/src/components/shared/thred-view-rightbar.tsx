import { useParams, Link } from "react-router-dom";
import { useGetThreadByID } from "@/features/thread/api/get-thread";
import { useGetCommunityById } from "@/features/community/api/get-community"; 
import { FaBirthdayCake, FaUsers, FaCompass } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Community } from "@/types";

export const ThreadViewRightSidebar = () => {
  const { id } = useParams(); 
  const { data: thread, isFetching: isFetchingThread } = useGetThreadByID({ threadId: id || "" }); 

  const communityId = thread?.communityId;
  const { data: community, isFetching: isFetchingCommunity } = useGetCommunityById({ id: communityId || "" }); 

  if (isFetchingThread || isFetchingCommunity) {
    return <div>Loading...</div>;
  }

  return (
    <div
    >
      {community ? (
        <CommunityDetails community={community} />
      ) : (
        <JoinCommunityCard />
      )}
    </div>
  );
};


interface CommunityDetailsProp {
  community: Community;
}

const CommunityDetails = ({ community }: CommunityDetailsProp) => (
    <Card className="bg-primary border-none shadow-lg max-w-[500px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={community.icon} alt={community.name} />
            <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{community.name}</h3>
            <p className="text-xs text-muted-foreground">Community</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{community.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <FaBirthdayCake className="text-accent" />
            <p>
              Created on{" "}
              {new Date(community.createdAt || new Date()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            </div>
          <div className="flex items-center gap-2">
            <FaUsers className="text-accent" />
            <p>{2} members</p>
          </div>
        </div>
        <Button className="w-full text-accent-foreground">Join Community</Button>
      </CardContent>
    </Card>
  );
  
  const JoinCommunityCard = () => (
    <Card className="bg-primary border-none shadow-lg max-w-[500px]">
      <CardHeader>
        <CardTitle className="text-center text-xl">Discover Communities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Join a community to connect with like-minded individuals and explore exciting topics!
        </p>
        <div className="flex justify-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/community-placeholder.png" alt="Community" />
            <AvatarFallback><FaCompass className="h-8 w-8" /></AvatarFallback>
          </Avatar>
        </div>
        <Button asChild className="w-full text-sm text-accent-foreground">
          <Link to="/community/all">Explore Communities</Link>
        </Button>
      </CardContent>
    </Card>
  );
  
  