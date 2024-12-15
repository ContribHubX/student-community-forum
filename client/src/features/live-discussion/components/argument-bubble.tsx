import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, MessageSquare, X, GraduationCap, BookmarkPlus } from 'lucide-react'
import { Argument } from '@/types'

interface ArgumentBubbleProps {
  argument: Argument,
  onReact: (id: string, reaction: 'likeCount' | 'dislikeCount') => void
  onReply: (id: string) => void
  onDrag: (id: string, newPosition: { x: number; y: number }) => void
  onClose: (id: string) => void
  onSave: (id: string) => void
  isMasonryLayout: boolean
}

const ArgumentBubble = ({
  argument,
  onReact,
  onReply,
  onDrag,
  onClose,
  onSave,
  isMasonryLayout
}: ArgumentBubbleProps) => {
  const { id, content, createdBy, likeCount, dislikeCount, position, tags, createdAt } = argument;
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragPosition, setDragPosition] = useState(position)

  const userLiked = false; 

  const bubbleStyle = isMasonryLayout
    ? "w-full mb-4"
    : "absolute"

  return (
    <motion.div
      drag={!isMasonryLayout}
      dragMomentum={false}
      initial={isMasonryLayout ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.8 }}
      animate={isMasonryLayout ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, x: dragPosition.x, y: dragPosition.y }}
      exit={isMasonryLayout ? { opacity: 0, y: -20 } : { opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onDragEnd={(_, info) => {
        const newPosition = { x: dragPosition.x + info.offset.x, y: dragPosition.y + info.offset.y };
        setDragPosition(newPosition);
        onDrag(id, newPosition);
      }}
      className={`${bubbleStyle} bg-primary text-primary-foreground rounded-lg p-4 shadow-lg w-72 cursor-move`}
    >
      <button 
        onClick={() => onClose(id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
      <div className="flex items-center space-x-2 mb-2"  >
        <Avatar>
          <AvatarImage src={createdBy.attachment} />
          <AvatarFallback>{createdBy.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-bold">{createdBy.name}</span>
        <GraduationCap className="h-6 w-6 text-blue-500" />
        <span className="text-xs text-muted-foreground">
          {new Date(createdAt || new Date()).toLocaleTimeString()}
        </span>
      </div>
      <p className={`mb-2 ${isExpanded ? '' : 'line-clamp-3'} text-sm`}>{content}</p>
      {!isExpanded && content.length > 100 && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="text-sm text-blue-500 hover:underline mb-2"
        >
          Read more
        </button>
      )}
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="dark:bg-background">{tag.name}</Badge>
        ))}
      </div>
      <div className='flex items-center justify-between'>
          <div className="flex space-x-2">
            <div onClick={() => onReact(id, 'likeCount')} className='flex cursor-pointer items-center justify-center gap-0 rounded-md'>
                <ThumbsUp className={`h-8 w-8 rounded-md hover:text-accent p-2 hover:bg-accent ${userLiked && "bg-accent text-accent-foreground"} hover:text-accent-foreground`} />
                <span className="ml-1 text-sm">{likeCount}</span>
            </div>
            <div onClick={() => onReact(id, 'dislikeCount')} className='flex cursor-pointer items-center justify-center gap-0 rounded-md'>
                <ThumbsDown className={`h-8 w-8 rounded-md hover:text-accent p-2 hover:bg-accent ${userLiked && "bg-accent text-accent-foreground"} hover:text-accent-foreground`} />
                <span className="ml-1 text-sm">{dislikeCount}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <div onClick={() => onReply(id)} className='flex cursor-pointer items-center justify-center gap-0 rounded-md'>
                <MessageSquare className={`h-8 w-8 rounded-md hover:text-accent p-2 hover:bg-accent ${userLiked && "bg-accent text-accent-foreground"} hover:text-accent-foreground`} />
            </div>
            <div onClick={() => onSave(id)} className='flex cursor-pointer items-center justify-center gap-0 rounded-md'>
                <BookmarkPlus className={`h-8 w-8 rounded-md hover:text-accent p-2 hover:bg-accent ${userLiked && "bg-accent text-accent-foreground"} hover:text-accent-foreground`} />
            </div>
          </div>
      </div>
    </motion.div>
  )
}

export default memo(ArgumentBubble);