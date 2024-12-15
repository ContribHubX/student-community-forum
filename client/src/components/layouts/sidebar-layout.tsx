import { ReactNode } from "react";

interface SidebarLayoutProps {
  position?: `left-${number}` | `right-${number}`;
  height?: "full" | "auto" | number;
  children: ReactNode;
  className?: string;
  width?: number;
}

export const SidebarLayout = ({
  height,
  children,
  width,
  className,
}: SidebarLayoutProps) => {
  let calculatedHeight = "auto";

  if (height === "full") {
    calculatedHeight = "calc(100vh - 8rem)";
  } else if (typeof height === "number") {
    calculatedHeight = "number";
  }

  // return (
  //   <aside
  //     className={`fixed overflow-y-auto ${position} ${className} rounded-2xl`}
  //     id="sidebar-container"
  //     style={{
  //       height: calculatedHeight,
  //       width: width,
  //     }}
  //   >
  //     {children}
  //   </aside>
  // );

  return (
    <aside
      className={` ${className} rounded-2xl`}
      id="sidebar-container"
      style={{
        height: calculatedHeight,
        width: width,
      }}
    >
      {children}
    </aside>
  );
};
