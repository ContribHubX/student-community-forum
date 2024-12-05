import { MainLayout } from "@/components/layouts/layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { RightSidebar } from "@/components/shared/right-sidebar";
import { Threads } from "@/features/thread/components";
import { useAuth } from "@/hooks/use-auth";

// TODO make creating answer realtime, creating question in a topic etcc..
// TODO setup seeders data
// TODO make colors in study room constant
// TODO finalize communities route

export const HomeRoute = () => {  
  const { authState } = useAuth();

  if (!authState?.user?.id) return <p>Loading...</p>;

  return (
    <MainLayout LeftSidebar={LeftSidebar} RightSidebar={RightSidebar}>
      <section
        className="bg-background border-3 border-black
        md:ml-[16rem] lg:mr-[22rem]
        "
      >
        <Threads />
      </section>
    </MainLayout>
  );
};
