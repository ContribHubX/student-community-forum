import { useState } from "react";
import { useNavigate } from "react-router-dom"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { MessageCircle, Users } from 'lucide-react'

interface LiveDiscussionCardProps {
  communityId: string;
  activeUsers?: number;
  isJoined: boolean;
}

export const LiveDiscussionCard = ({ isJoined, communityId, activeUsers = 0 }: LiveDiscussionCardProps) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false); 

  const navigateToLiveDiscussion = () => {
    if (isJoined)
        navigate(`/community/live-discussion/${communityId}`);
    else 
        setOpenDialog(true); 
  }

  return (
    <Card className="w-full bg-primary text-primary-foreground dark:border-none shadow-lg transition-colors rounded-xl cursor-pointer" >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Live Discussion
        </CardTitle>
        <CardDescription className="text-primary-foreground">
          Join the real-time conversation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{activeUsers} active</span>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="hover:bg-accent hover:text-accent-foreground bg-background"
            onClick={navigateToLiveDiscussion}
          >
            Join Now
          </Button>
        </div>
      </CardContent>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
            <p>Must be a member first</p>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

