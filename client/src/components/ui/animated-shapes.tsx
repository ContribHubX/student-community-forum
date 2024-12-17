import { motion } from "framer-motion";

export const AnimatedShapes = () => {
  return (
    <>
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 bg-purple-200 rounded-lg"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-20 w-12 h-12 bg-green-200 rounded-full"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
      />
    </>
  );
};

