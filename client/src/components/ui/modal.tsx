import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
}

export const Modal = ({ className, isOpen, onClose, children }: ModalProps) => {
  return isOpen ? (
    <div
      id="thread-form-modal-container"
      className={`z-50 top-0 left-0 fixed h-screen w-screen bg-black 
        transition-opacity duration-300 bg-opacity-95 grid place-content-center`}
      style={{ transition: "opacity 0.3s ease" }}
    >
      <div
        className={`rounded-xl p-5 gap-5 bg-primary max-h-[600px] flex flex-col overflow-x-scroll ${className}`}
      >
        <div
          onClick={onClose}
          className="shrink-0 cursor-pointer text-white h-7 w-7 rounded-full bg-red-400 grid place-content-center self-end"
        >
          <IoMdClose />
        </div>
        {children}
      </div>
    </div>
  ) : null;
};