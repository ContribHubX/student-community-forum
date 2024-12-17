import { motion } from "framer-motion";

export const StudentHubIllustration = () => {
  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.circle
        cx="150"
        cy="150"
        r="145"
        fill="#E6F0FF"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.path
        d="M70 180C70 153.49 91.49 132 118 132H182C208.51 132 230 153.49 230 180V220H70V180Z"
        fill="#3B82F6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
      />
      <motion.circle
        cx="150"
        cy="100"
        r="40"
        fill="#3B82F6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M110 220V180C110 171.716 116.716 165 125 165H175C183.284 165 190 171.716 190 180V220"
        stroke="white"
        strokeWidth="6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

