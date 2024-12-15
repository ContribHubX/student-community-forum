import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import React from "react";

interface SidebarItemProps {
  title: string;
  icon: string | IconType;
  description: string;
  iconBgcolor: string;
  containerStyle?: string;
  link?: string;
  imgStyle?: string;
  showDesc?: boolean;
  descStyle?: string;
}

export const SideBarItem = ({
  title,
  icon,
  description,
  iconBgcolor,
  containerStyle,
  link,
  imgStyle,
  descStyle,
  showDesc = true,
}: SidebarItemProps) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
  };
  return (
    <Link to={link || ""}>
      <div
        className={cn(
          `flex  gap-1 xs:gap-2 p-1 rounded-lg hover:bg-background items-center`,
          containerStyle,
        )}
      >
        <div
          className={`rounded-xl h-8 w-8 flex items-center justify-center`}
          style={{ backgroundColor: iconBgcolor }}
        >
          {typeof icon === "string" ? (
            <img src={icon} alt="" className={cn("h-5", imgStyle)} />
          ) : (
            React.createElement(icon)
          )}
        </div>

        <div className={cn("text-sm", descStyle)}>
          <p>{truncateText(title, 15)}</p>
          <p
            className={`text-xs text-muted-foreground font-light ${!showDesc && "hidden"}`}
          >
            {truncateText(description, 22)}
          </p>
        </div>
      </div>
    </Link>
  );
};
