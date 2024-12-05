import { useState } from "react";
import { motion } from "framer-motion";
import { Topic } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface TopicLibraryCardProps {
  topic: Topic;
}

export const TopicLibraryCard = ({ topic }: TopicLibraryCardProps) => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="h-[350px] overflow-hidden relative group dark:border-0 shadow-md"
        onClick={() => navigate(`/topic/${topic.id}`)}
      >
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: `url(${topic.attachment})` }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <CardContent className="relative z-20 h-full flex flex-col justify-end p-6">
          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {topic.name}
          </motion.h2>
          <motion.p
            className="text-sm text-white/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover and learn more by engaging with expert resources on this
            topic
          </motion.p>
          <motion.div
            className="mt-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 inline-block"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="text-xs font-medium text-white">
              Explore Topic
            </span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
