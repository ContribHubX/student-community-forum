import { IoMdNotifications } from "react-icons/io";
import { useState } from "react";
import { useGetNotifications } from "../api/get-notifications";
import { Notification } from "@/types";

interface NotificationDropdownProp {
  userId: string;
}

export const NotificationDropdown = ({ userId }: NotificationDropdownProp) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: notifications } = useGetNotifications({ userId: userId || "" });

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "❤️";
      case "dislike":
        return "👎";
      case "comment":
        return "💬";
      case "reply":
        return "🔁";
      case "assigned":
        return "✅";
      case "updated":
        return "✏️";
      case "completed":
        return "🏆";
      case "request":
        return "❓";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative">
    <div className="p-2 relative rounded-md bg-background hover:bg-accent group">
      <div 
        className="w-[5px] h-[5px] bg-red-400 rounded-full absolute right-[12px] top-3"
      />
      <IoMdNotifications
        className="text-2xl text-primary-foreground group-hover:text-accent-foreground cursor-pointer transition-colors"
        onClick={toggleNotifications}
      />
    </div>

      {showNotifications && (
        <div
          className={`absolute right-0 mt-2 w-80 bg-primary text-primary-foreground rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ${
            isExpanded ? "max-h-[600px]" : "max-h-[360px]"
          } overflow-hidden`}
        >
          <div className="px-4 py-3 border-b">
            <span className="text-lg font-semibold">Notifications</span>
          </div>
          <ul
            className={`divide-y divide-gray-200 ${
              isExpanded ? "max-h-[500px] overflow-y-auto " : "max-h-[250px]"
            }`}
          >
            {notifications && notifications.length > 0 ? (
              notifications.map((notification: Notification) => (
                <li
                  key={notification.id}
                  className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
                    <span role="img" aria-label={notification.type}>
                      {renderNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium">
                      {notification.createdBy?.name}
                    </span>{" "}
                    {notification.message}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-gray-500">
                No notifications available.
              </li>
            )}
          </ul>
          <div className="px-4 py-3 text-center border-t bg-white relative">
            <button
              onClick={toggleExpand}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isExpanded ? "Show less" : "View all notifications"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
