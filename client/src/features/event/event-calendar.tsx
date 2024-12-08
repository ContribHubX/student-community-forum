import { useState } from 'react'
import { eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isToday, startOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateEventForm } from './create-event-form'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { CommunityEvent } from '@/types'

interface EventCalendarProps {
  events: CommunityEvent[];
  communityId: string;
  userId: string;
}

export const EventCalendar = ({ events, communityId, userId }: EventCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const firstDayOfMonth = startOfMonth(currentDate)
  const lastDayOfMonth = endOfMonth(currentDate)

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  })

  const startingDayIndex = getDay(firstDayOfMonth)

  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1))
  }

  return (
    <Card className="min-w-full mx-auto bg-primary dark:border-none">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {daysInMonth.map((day, index) => {
            const dayEvents = events.filter(event => isSameDay(event.eventDate, day))
            return (
              <Card
                key={index}
                className={`p-2 h-24 overflow-hidden dark:border-none w-[130px] bg-background ${
                  isToday(day) ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <div className="text-right mb-1">{format(day, 'd')}</div>
                <ScrollArea className="h-16">
                  {dayEvents.map(event => (
                    <Badge key={event.id}  variant="secondary" className="mb-1 w-full justify-start bg-accent text-accent-foreground">
                      {event.name}
                    </Badge>
                  ))}
                </ScrollArea>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button className='text-sm text-accent-foreground'>
                <Plus className="mr-0 h-4 w-4" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className=' dark:border-none'>
              <CreateEventForm 
                communityId={communityId}
                userId={userId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

