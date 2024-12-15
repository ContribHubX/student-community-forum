import { useCallback, useState } from "react";

export const useDisclosure = () => {
  const [isOpen, setOpen] = useState(false);

  const open = useCallback(() => {
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
  }, []);
  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen]);

  return { isOpen, open, close, toggle, setOpen };
};
