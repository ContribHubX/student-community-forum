import { Link } from "react-router-dom";
import clsx from "clsx";

interface SidebarItemProps {
  title: string;
  icon: string;
  description: string;
  iconBgcolor: string;
  containerStyle?: string;
  link?: string;
}

export const SideBarItem = ({
  title,
  icon,
  description,
  iconBgcolor,
  containerStyle,
  link,
}: SidebarItemProps) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
  };
  return (
    <Link to={link || ""}>
      <div className={clsx(`flex gap-2 p-1 rounded-lg`, containerStyle)}>
        <div
          className={`rounded-xl h-8 w-8 flex items-center justify-center`}
          style={{ backgroundColor: iconBgcolor }}
        >
          <img src={icon} alt="" className="h-5" />
        </div>

        <div>
          <p className="text-sm">{truncateText(title, 15)}</p>
          <p className="text-xs text-muted-foreground font-light">
            {truncateText(description, 22)}
          </p>
        </div>
      </div>
    </Link>
  );
};
