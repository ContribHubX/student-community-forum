import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewPostIndicatorProps {
  type: "thread" | "question" | "topic";
  showIndicator: boolean;
  handleIndicatorClick: () => void;
}

export const NewPostIndicator = ({ type, showIndicator, handleIndicatorClick }: NewPostIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
        setIsVisible(showIndicator);
    
  }, [showIndicator]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
           className="fixed bottom-6 left-[50%] -translate-x-1/2 z-50 flex justify-center items-center"
          onClick={() => {
            handleIndicatorClick();
            setIsVisible(false);
          }}
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span className="font-semibold">
                New {type}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
