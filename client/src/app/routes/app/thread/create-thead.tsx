import { MainLayout } from "@/components/layouts/layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";

import { useAuth } from "@/hooks/use-auth";

import { CreateThreadForm } from "@/features/shared/components/create-thread-form";
import { useCreateThread } from "@/features/shared/api/create-thread";

export const CreateThreadRoute = () => {
  const { authState } = useAuth();
  const { mutate: createThread } = useCreateThread({});

  if (!authState?.user?.id) return <p>Loading...</p>;
    
  const handleCreateThread = (data: FormData) => {
    createThread(data);
  };

  return (
    <MainLayout LeftSidebar={LeftSidebar}>
      <section
        className="bg-background border-3 border-black
        md:ml-[16rem] 
        "
      >
       <CreateThreadForm 
            handleFormSubmit={handleCreateThread}
            userId={authState.user.id}
       />
      </section>
    </MainLayout>
  );
};
