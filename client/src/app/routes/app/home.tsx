import { useEffect, useRef } from "react";

import { MainLayout } from "@/components/layouts/layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { RightSidebar } from "@/components/shared/right-sidebar";
import { NewPostIndicator } from "@/components/ui/new-post-indicator";

import { Threads } from "@/features/thread/components";
import { useAuth } from "@/hooks/use-auth";
import { useNewPostIndicator } from "@/hooks/use-post-indicator";
import { useSocketProvider } from "@/hooks/use-socket-provider";

import { MyLoader } from "@/components/shared/loader";
// DONE make task deletion realtime
// DONE joing user community
// DONE merge community by nnz (focus on community sa)
// DONE when voting in a community page like and dislike count doesnt reflect
// DONE creating threads through topic page should make the form display the initial topic
// DONE navigate to topic page if creating a thread in that topic
// DONE dix displaying multiple community when creating thread
// DONE add realtime indicator when creating a questiona and thread
// DONE local register
// DONE make profile page

// TODO live discussion capability
// TODO user's can share the live discussion, study room in a general thread

// TODO add user saved
// TODO add names in cursors in kanban, the picture is in my messenger
// DECIDE live polls feature

// TODO fix bug's on mj's dev test
// TODO make it responsive up to laptop size // not yet implemented in question page
// TODO decde whether to expand the topic-view-card horizontally
// TODO toast and navigate to homepage after edit thread
// TODO notification when user answering question request
// TODO fix creating task in study room, make it realtime

// TODO setup navbar nav links
// TODO add delete in topic
// TODO impl study room new features
// TODO add community and topic in thread card
// TODO setup seeders data
// TODO make colors in study room constant
// TODO finalize communities route
// TODO topic creation
// TODO fix when voting a question

export const HomeRoute = () => {
  const { authState } = useAuth();
  const threadsRef = useRef<HTMLDivElement>(null);
  const { isVisible, showIndicator, handleIndicatorClick } =
    useNewPostIndicator({ elementRef: threadsRef });
  const { socketState } = useSocketProvider();

  useEffect(() => {
    if (
      !socketState ||
      !socketState.globalEvent ||
      socketState.globalEvent.type !== "thread"
    )
      return;

    showIndicator();
  }, [socketState.globalEvent]);

  if (!authState?.user?.id) {
    <MyLoader />;
  }

  // return (
  //   <MainLayout LeftSidebar={LeftSidebar} RightSidebar={RightSidebar}>
  //     <section
  //       className="bg-background border-3 border-black
  //       md:ml-[16rem]
  //       lg:mr-[18rem]
  //       xl:mr-[20rem]
  //       "
  //       ref={threadsRef}
  //     >
  //       <Threads />
  //       <NewPostIndicator
  //         type="thread"
  //         showIndicator={isVisible}
  //         handleIndicatorClick={handleIndicatorClick}
  //       />
  //     </section>
  //   </MainLayout>
  // );

  return (
    <MainLayout LeftSidebar={LeftSidebar} RightSidebar={RightSidebar}>
      <section className="bg-background border-3 border-black" ref={threadsRef}>
        <Threads />
        <NewPostIndicator
          type="thread"
          showIndicator={isVisible}
          handleIndicatorClick={handleIndicatorClick}
        />
      </section>
    </MainLayout>
  );
};
