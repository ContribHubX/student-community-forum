import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {  Sparkles, TrendingUp, Users } from 'lucide-react';
import { useGetThreads } from '@/features/thread/api/get-all-threads';
import { useGetQuestions } from '@/features/shared/api/get-all-question';
import { Question } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useGetStudyRooms } from '@/features/study-room/api/get-rooms';

interface CommunityInsightsBar {
    userId: string;
}

export const CommunityInsightsBar = ({ userId }: CommunityInsightsBar) => {
  const { data: threads } = useGetThreads({});
  const { data: questions, } = useGetQuestions({});
  const { data: studyRooms } = useGetStudyRooms({});
  
  const [users, setUsers] = useState<Record<string, number>>({});
  const navigate = useNavigate();
    
  const userContribs = threads?.reduce((prev, current) => current.createdBy.id.toString() === userId.toString() ? prev + 1 : prev, 0)

  const currentRoom = useMemo(() => Math.floor(Math.random() * 3 + 1) - 1, [])

  const hotQuestions = (questions || []).sort(
    (a: Question, b: Question) => b.threads.length - a.threads.length
  );
  
  useEffect(() => {
    if (!threads) return;

    const userCounts: Record<string, number> = {};

    threads.forEach(thread => {
        const username = thread.createdBy.name;
    
        if (!userCounts[username]) {
            userCounts[username] = 1;
        } else {
            userCounts[username] += 1;
        }
        
        setUsers(userCounts);
    })      

  }, [threads])

  return (
    <aside className="w-80 space-y-4  border-gray-200 max-w-[200px]  dark:border-none xl:max-w-[300px]">
      <Card className="bg-primary dark:border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Community Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        <div>
            <h3 className="text-sm font-medium mb-2">User Contributions</h3>
            <Progress value={userContribs || 0} max={100} className="h-2"  indicatorColor={"#533de0"} />
            <p className="text-xs text-gray-500 mt-1">
                {userContribs || 0} contributions this week
            </p>
        </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Top Contributors</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(users).map(([key]) => (
                <Badge key={key} variant="secondary" className='bg-accent text-accent-foreground'>
                  {key}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary dark:border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Hot Discussions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {hotQuestions.slice(0, 3)?.map((discussion) => (
              <li key={discussion.id} className="text-sm">
                <a onClick={() => navigate(`/question/${discussion.id}`)} className="hover:underline  decoration-accent cursor-pointer">
                  {discussion.title}
                </a>
                <p className="text-xs text-gray-500">{discussion.threads.length || 0} participants</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>


      <Card className="bg-gradient-to-br dark:border-none from-blue-500 to-purple-600 text-white">
        <CardContent className="pt-6">
          <Users className="w-8 h-8 mb-2" />
          <h3 className="text-2xl font-bold mb-1">Join a Study Group</h3>
          <p className="text-sm mb-4">Collaborate with peers and boost your learning!</p>
          <Button 
            variant="secondary" 
            className="w-full bg-background"
            onClick={() => {
                const roomId = studyRooms?.[currentRoom]?.id;
                if (roomId) {
                  navigate(`/study-room/${roomId}`);
                } else {
                  console.error("StudyRooms or the current room is undefined.");
                }
            }}
           >
            Find Groups
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
};

