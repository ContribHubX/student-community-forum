import { SidebarLayout } from "@/components/layouts/sidebar-layout";

export const RightSidebar = () => {
  return (
    <SidebarLayout
      position="right-6"
      width={250}
      height={"full"}
      className="bg-primary shadow-slate-400 shadow-md hidden
      md:block"
    >
      <div>
        <p>asd</p>
      </div>
    </SidebarLayout>
  );
};
