import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, UserCheck, BookMarked, Brain, LayoutGrid, Move } from 'lucide-react'
import  ArgumentBubble  from './argument-bubble'
import { MasonryLayout } from '@/components/layouts/masonry'
import { Argument, ArgumentTag } from '@/types'
import { initialArguments, popularTags } from '../data/arguments'
import { useParams } from 'react-router-dom'
import { useSocketProvider } from '@/hooks/use-socket-provider'
import { useGetCommunityById } from '@/features/community/api/get-community'
import { useAuth } from '@/hooks/use-auth'
import { OPERATION } from '@/providers/socket/context'
import { useDisclosure } from '@/hooks/use-disclosure'
import { VotingPoll } from './voting-poll'

export const LiveForumDiscussion = () => {
  const { communityId } = useParams();
  const { isOpen: showVotingPoll, toggle: toggleVotingPoll } = useDisclosure();

  const [discussionArguments, setDiscussionArguments] = useState<Argument[]>([])
  const [newArgument, setNewArgument] = useState('')
  const [selectedTags, setSelectedTags] = useState<ArgumentTag[]>([])
  const [savedArguments, setSavedArguments] = useState<string[]>([])
  const [isMasonryLayout, setIsMasonryLayout] = useState(false)
  const isEmitting = useRef(false);

  const { data: community } = useGetCommunityById({ id: communityId || "" });

  const { socketState, socketDispatch } = useSocketProvider();
  const { authState } = useAuth();

  useEffect(() => {
    if (!socketState || !communityId) return;
    
    const currentRoom = socketState.discussions[communityId];

    if (!currentRoom) return;

    if (currentRoom.currentArgumentModified) {
        const modifiedArgument = currentRoom.currentArgumentModified;
        setDiscussionArguments((prev) =>
            prev.map((arg) =>
                arg.id === modifiedArgument.id ? {...arg, likeCount: modifiedArgument.likeCount, dislikeCount: modifiedArgument.dislikeCount} : arg
            )
        );
        socketDispatch({
            type: OPERATION.RESET_REACTED_ARGUMENT,
            payload: { discussionId: communityId }
        })

        return;
    }

    if (currentRoom.currentArgument && currentRoom.currentArgument.id) {
        const isPresent = discussionArguments.some(arg => arg?.id === currentRoom.currentArgument?.id);
        if (!isPresent) {
            setDiscussionArguments((prev) => [...prev, currentRoom.currentArgument as Argument]);
        }
    } else {
        if (discussionArguments.length === 0)
            setDiscussionArguments([...currentRoom.arguments]);
    }

  }, [communityId, socketState])

  useEffect(() => {
    if (!communityId || !community || !authState || !authState.user || !socketState.socket) return; 

    socketState.socket.emit("client__user-discussion--join", {
        user: authState.user,
        community
    })

    return () => {
        if (!socketState.socket) return;

        socketState.socket.emit("client__user-discussion--left", { user: authState.user });
        console.log("unmounted");
        socketState.socket?.removeListener("client__user-discussion--join");
    }

  }, [authState, community, communityId, socketState.socket])

  const sendArgument = () => {
    if (!authState.user || !socketState.socket) return;
  
    if (!newArgument.trim() || isEmitting.current) return;
  
    isEmitting.current = true;
  
    const argument: Argument = {
      id: Date.now().toString(),
      content: newArgument,
      createdBy: authState.user,
      createdAt: new Date(),
      likeCount: 0,
      dislikeCount: 0,
      position: {
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 300),
      },
      tags: selectedTags,
      communityId: communityId || "",
    };
  
    socketState.socket.emit("client__discussion-argument--new", argument, () => {
      isEmitting.current = false; 
    });
  
    setNewArgument('');
    setSelectedTags([]);
  
    setTimeout(() => {
      isEmitting.current = false;
    }, 1000); 
  };
  
  const reactToArgument = useCallback((id: string, reaction: 'likeCount' | 'dislikeCount') => {
    if (!authState.user || !socketState.socket || id.startsWith("test")) return;

    socketState.socket.emit("client__discussion-argument--react", {
        argumentId: id,
        reaction: reaction === "likeCount" ? "like" : "dislike"
    })
  }, [authState.user, socketState.socket])

  const handleReply = useCallback((id: string) => {
    const inputElement = document.querySelector('input') as HTMLInputElement
    if (inputElement) {
      const argAuthor = discussionArguments.find(arg => arg.id === id)?.createdBy.name;
      setNewArgument(`@${argAuthor} `)
      inputElement.focus()
    }
  }, [discussionArguments])

  const handleDrag = useCallback((id: string, newPosition: { x: number; y: number }) => {
    if (isMasonryLayout) return; 
    setDiscussionArguments(prev => prev.map(arg =>
      arg.id === id ? { ...arg, position: newPosition } : arg
    ))
  }, [isMasonryLayout]);

  const handleClose = useCallback((id: string) => {
    setDiscussionArguments(prev => prev.filter(arg => arg.id !== id))
  }, [])

  const toggleTag = (tag: ArgumentTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t.name !== tag.name) : [...prev, tag]
    )
  }

  const saveArgument = useCallback((id: string) => {
    setSavedArguments(prev => [...prev, id])
  }, [])

  const toggleLayout = () => {
    setIsMasonryLayout(prev => !prev)
  }

  const renderArguments = () => {

    const allArguments = [...initialArguments, ...discussionArguments];
    
    if (isMasonryLayout) {
      return (
        <MasonryLayout>
          {allArguments.map((arg) => (
            <ArgumentBubble
              key={arg.id}
              argument={arg}
              onReact={reactToArgument}
              onReply={handleReply}
              onDrag={handleDrag}
              onClose={handleClose}
              onSave={saveArgument}
              isMasonryLayout={isMasonryLayout}
            />
          ))}
        </MasonryLayout>
      );
    } else {
      return (
        <AnimatePresence>
          {allArguments.map((arg) => (
            <ArgumentBubble
              key={arg.id}
              argument={arg}
              onReact={reactToArgument}
              onReply={handleReply}
              onDrag={handleDrag}
              onClose={handleClose}
              onSave={saveArgument}
              isMasonryLayout={isMasonryLayout}
            />
          ))}
        </AnimatePresence>
      );
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute top-4 left-4 z-10 space-y-4">
        <Card className="w-80 dark:border-none bg-primary shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Open Forum</span>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-normal">{socketState?.discussions[communityId || ""]?.users.length || 0} active</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-2">
              {popularTags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`${selectedTags.includes(tag) ? "bg-accent text-accent-foreground" : "dark:bg-background"} cursor-pointer `}
                  onClick={() => toggleTag(tag)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <Input
                value={newArgument}
                onChange={(e) => setNewArgument(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-grow"
              />
              <Button onClick={sendArgument} className='hover:bg-accent hover:text-accent-foreground bg-background rounded-md'>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Saved Arguments: {savedArguments.length}</h3>
              <div className="flex items-center space-x-2">
                <BookMarked className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Click to review later</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={toggleVotingPoll}
            >
              <Brain className="mr-2 h-4 w-4" />
              {showVotingPoll ? "Hide" : "Show"} Voting Poll
            </Button>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={toggleLayout}
            >
              {isMasonryLayout ? <Move className="mr-2 h-4 w-4" /> : <LayoutGrid className="mr-2 h-4 w-4" />}
              {isMasonryLayout ? "Free Arrange" : "Masonry Layout"}
            </Button>
          </CardContent>
        </Card>
        <AnimatePresence>
          {showVotingPoll && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <VotingPoll />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {renderArguments()}
    </div>
  )
}

