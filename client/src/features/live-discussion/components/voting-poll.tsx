import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { PlusCircle, Trash2, BarChart2 } from 'lucide-react'

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export const VotingPoll = () => {
  const [pollTitle, setPollTitle] = useState('')
  const [options, setOptions] = useState<PollOption[]>([])
  const [newOption, setNewOption] = useState('')
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    setTotalVotes(options.reduce((sum, option) => sum + option.votes, 0))
  }, [options])

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, { id: Date.now().toString(), text: newOption, votes: 0 }])
      setNewOption('')
    }
  }

  const removeOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id))
  }

  const vote = (id: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, votes: option.votes + 1 } : option
    ))
  }

  return (
    <Card className="w-80 shadow-lg bg-primary dark:border-none">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Input
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
            placeholder="Enter poll title..."
            className="font-semibold text-lg border-none focus-visible:ring-0"
          />
          <BarChart2 className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Add new option..."
            className="flex-grow"
          />
          <Button onClick={addOption} variant="outline" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <AnimatePresence>
          {options.map(option => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => vote(option.id)} 
                  variant="outline" 
                  className="flex-grow justify-between h-auto py-2"
                >
                  <span className="text-left">{option.text}</span>
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                    {option.votes}
                  </span>
                </Button>
                <Button onClick={() => removeOption(option.id)} variant="ghost" size="icon" className="shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0} className="h-2 bg-black" />
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

