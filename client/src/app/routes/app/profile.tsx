/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActivityTabs } from "@/features/profile/components/activity-tabs";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/components/layouts/layout";
import { useGetThreads } from "@/features/thread/api/get-all-threads";
import { useGetQuestions } from "@/features/shared/api/get-all-question";
import { useGetTopics } from "@/features/topic/api";

export const ProfileRoute = () => {
  const { authState } = useAuth();
  const { data: threads } = useGetThreads({});
  const { data: questions } = useGetQuestions({});
  const { data: topics } = useGetTopics({});

  if (!authState?.user?.id) return <p>Loading...</p>;

  return (
    <MainLayout>
      <section
        className="bg-background border-3 border-black
            
            "
      >
        <div className="min-h-screen ">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <ProfileHeader user={authState.user} />
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-3 w-full">
                <ActivityTabs
                  threads={threads}
                  questions={questions}
                  topics={topics}
                />
              </div>
              {/* <div className="space-y-8">
                    <AchievementShowcase user={user} />
                    <RecentActivity user={user} />
                  </div> */}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
