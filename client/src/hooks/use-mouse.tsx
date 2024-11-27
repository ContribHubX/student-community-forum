import { useEffect, useState } from "react";
import { CursorPosition } from "@/types";

export const useMouse = (): CursorPosition => {
  const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };
  
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [])

  return mousePosition;  
}
