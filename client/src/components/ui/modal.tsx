import { motion } from "framer-motion";
import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
  isExit?: boolean;
}

export const Modal = ({
  className,
  isOpen,
  onClose,
  children,
  isExit = false,
}: ModalProps) => {
  return (
    isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        id="thread-form-modal-container"
        className={`z-50 top-0 left-0 fixed h-screen w-screen bg-[#00000080]
        grid place-content-center`}
      >
        <div
          className={`rounded-xl p-5 gap-5 bg-primary max-h-[600px] max-w-[800px] flex flex-col ${className}`}
        >
          {!isExit && (
            <div
              onClick={onClose}
              className="shrink-0 cursor-pointer text-white h-7 w-7 rounded-full bg-red-400 grid place-content-center self-end"
            >
              <IoMdClose />
            </div>
          )}
          {children}
        </div>
      </motion.div>
    )
  );
};
