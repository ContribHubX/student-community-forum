import { ReactNode } from "react";

interface SidebarLayoutProps {
  position: `left-${number}` | `right-${number}`;
  height?: number;
  children: ReactNode;
  className?: string;
  width?: number;
}

export const SidebarLayout = ({
  position,
  height,
  children,
  width,
  className,
}: SidebarLayoutProps) => {
  return (
    <aside
      className={`fixed overflow-y-scroll ${position} ${className}`}
      id="sidebar-container"
      style={{
        height: height ? height : "calc(100vh - 8rem)",
        width: width ? width : "220px",
      }}
    >
      {children}
    </aside>
  );
};
