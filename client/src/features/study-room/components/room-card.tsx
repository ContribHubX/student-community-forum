import { Users, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { users } from "@/features/shared/data/users";

import { StudyRoom } from "@/types";
import { useNavigate } from "react-router-dom";

interface RoomCardProp {
  room: StudyRoom;
}

export const RoomCard = ({ room }: RoomCardProp) => {
  const navigate = useNavigate();

  return (
    <Card
      className="min-w-[300px] md:min-w-[400px] min-h-[300px] max-h-[400px]  overflow-hidden relative group flex flex-col dark:border-0 hover:shadow-lg transition-shadow duration-300"
      onClick={() => navigate(`/study-room/${room.id}`)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundImage: `url(${room.attachment})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 dark:from-gray-900/50 dark:to-gray-900/80" />
      </div>

      <div className="relative z-10 flex flex-col justify-between flex-grow">
        <CardHeader className="flex flex-row items-center justify-between text-gray-900">
          <div className="flex items-center gap-1">
            {users.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className={`rounded-full bg-accent-foreground p-[2px] ${index !== 0 ? "ml-[-15px]" : "ml-0"} transition-transform hover:scale-110 hover:z-10`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.attachment} className="object-cover" />
                  <AvatarFallback>U{index + 1}</AvatarFallback>
                </Avatar>
              </div>
            ))}
            {users.length > 3 && (
              <div className="ml-2 text-sm font-medium text-gray-300">
                +{users.length - 3} more
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-300 bg-gray-800/50  rounded-full px-3 py-1">
            <Users className="h-4 w-4 text-gray-300" />
            <span>6.8k</span>
          </div>
        </CardHeader>

        <CardContent>
          <CardTitle className="mb-2 text-2xl font-bold text-accent-foreground">
            {room.name.substring(0, 25)}
          </CardTitle>
          <p className="text-sm text-gray-300 mb-4">{room.description}</p>
        </CardContent>
      </div>

      <CardFooter className="flex flex-col items-start z-10 bg-primary backdrop-blur-sm p-4 space-y-4">
        <div className="flex flex-wrap gap-2 w-full">
          <Badge
            variant="secondary"
            className="bg-accent text-accent-foreground flex items-center gap-2 py-1 transition-colors hover:bg-accent/30"
          >
            <span>🎨</span>
            <span>Custom</span>
          </Badge>
          <Badge
            variant="secondary"
            className="bg-accent text-accent-foreground flex items-center gap-2 py-1 transition-colors hover:bg-accent/30"
          >
            <Clock className="h-4 w-4" />
            <span>45/15</span>
          </Badge>
          {/* <Badge variant="secondary" className="bg-accent text-accent-foreground flex items-center gap-2 py-1 transition-colors hover:bg-accent/30">
              <span>📚</span>
              <span>Focused Study</span>
            </Badge> */}
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 primary-foreground" />
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Next break in 32:10
            </span>
          </div>
          <Progress value={33} className="w-1/2 bg-background" />
        </div>

        <Button
          className="w-full group bg-background hover:bg-accent hover:text-accent-foreground"
          variant="secondary"
        >
          Join Room
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};
