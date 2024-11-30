

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Heart, ThumbsDown, MessageSquare, RotateCcw, CheckSquare, Edit, Trophy, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useGetNotifications } from "../api/get-notifications"
import { Notification } from "@/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface NotificationDropdownProp {
  userId: string
}

export const NotificationDropdown = ({ userId }: NotificationDropdownProp) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()

  const { data: notifications } = useGetNotifications({ userId: userId || "" })

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "dislike":
        return <ThumbsDown className="h-4 w-4 text-yellow-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "reply":
        return <RotateCcw className="h-4 w-4 text-green-500" />
      case "assigned":
        return <CheckSquare className="h-4 w-4 text-purple-500" />
      case "updated":
        return <Edit className="h-4 w-4 text-orange-500" />
      case "completed":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "request":
        return <HelpCircle className="h-4 w-4 text-cyan-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {notifications && notifications.length > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 dark:border-none dark:bg-background bg-primary" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <Button variant="ghost" size="sm" onClick={toggleExpand}>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <ScrollArea className={`${isExpanded ? 'h-[400px]' : 'h-[300px]'}`}>
          {notifications && notifications.length > 0 ? (
            <ul className="divide-y divide-border ">
              {notifications.map((notification: Notification) => (
                <li
                  key={notification.id}
                  className="flex items-start gap-4 px-4 py-3 hover:bg-accent transition-colors cursor-pointer group"
                  onClick={() => navigate(notification.link)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.createdBy?.attachment} alt={notification.createdBy?.name} />
                    <AvatarFallback>{notification.createdBy?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm group-hover:text-accent-foreground">
                      <span className="font-medium">{notification.createdBy?.name}</span>{' '}
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.createdAt?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {renderNotificationIcon(notification.type)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

