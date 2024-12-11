import { useCallback, useState } from "react";

interface UseNewPostIndicatorProps {
  elementRef: React.RefObject<HTMLDivElement>;
}

export const useNewPostIndicator = ({
  elementRef,
}: UseNewPostIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const showIndicator = useCallback(() => setIsVisible(true), []);

  const hideIndicator = useCallback(() => setIsVisible(false), []);

  const handleIndicatorClick = () => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    hideIndicator();
  };

  return {
    isVisible,
    showIndicator,
    handleIndicatorClick,
  };
};
