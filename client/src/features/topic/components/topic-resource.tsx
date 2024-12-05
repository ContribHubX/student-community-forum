import { useState } from 'react'
import { useGetTopics } from "../api"
import { TopicLibraryCard } from './topic-library-card'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from 'framer-motion'

export const TopicResource = () => {
  const { data: topics } = useGetTopics({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredTopics = topics?.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || topic.category === filter)
  )

  return (
    <div className="container mx-auto px-4 py-8 text-primary-foreground">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Topics</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredTopics?.map(topic => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TopicLibraryCard topic={topic} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredTopics?.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No topics found. Try adjusting your search or filter.</p>
      )}

      <div className="mt-12 text-center">
        <Button className='text-accent-foreground'>Load More Topics</Button>
      </div>
    </div>
  )
}

