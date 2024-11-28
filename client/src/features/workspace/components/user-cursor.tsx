import { useEffect, useState } from "react";
import { CursorPosition, User } from "@/types";
import { blendWithBlack } from "@/utils";

interface UserCursorProp {
  user: User;
  position: CursorPosition;
  color: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserCursor = ({ user, position, color }: UserCursorProp) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const blendedColor = blendWithBlack(color, 0.3);

  useEffect(() => {
    let animationFrame: number;

    const smoothMove = () => {
      setCurrentPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.2,
        y: prev.y + (position.y - prev.y) * 0.2,
      }));
      animationFrame = requestAnimationFrame(smoothMove);
    };

    smoothMove();

    return () => cancelAnimationFrame(animationFrame);
  }, [position]);

  return (
    <svg
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      className="transition pointer-events-none"
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        position: "fixed",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
    >
      <path
        d="M2.717 2.22918L15.9831 15.8743C16.5994 16.5083 16.1503 17.5714 15.2661 17.5714H9.35976C8.59988 17.5714 7.86831 17.8598 7.3128 18.3783L2.68232 22.7C2.0431 23.2966 1 22.8434 1 21.969V2.92626C1 2.02855 2.09122 1.58553 2.717 2.22918Z"
        fill={color}
        stroke={blendedColor}
        strokeWidth="2"
      />
    </svg>
  );
};
