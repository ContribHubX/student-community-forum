import { PiSealQuestionBold } from "react-icons/pi";
import ask from "@/assets/question/ask-1.svg";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateQuestionForm } from "../api/create-question-form";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";

export const Insight = () => {

  return (
    <SidebarLayout
      className="hidden flex-col gap-6 lg:flex"
      width={325}
      height={"full"}
      position="right-6"
    >
      <div className="bg-primary rounded-md flex flex-col gap-5 items-center justify-center h-[400px]">
        <img src={ask} alt="illustration" className="w-[200px] mx-auto" />
        <p className="text-muted-foreground text-sm text-center max-w-[300px]">
          Frame insightful questions based on this topic to deepen understanding.
        </p>
        <Dialog >
          <DialogTrigger>
            <button
              className="text-accent-foreground text-xl rounded-full bg-accent flex items-center justify-center py-3 px-4 gap-2"
            >
              <PiSealQuestionBold />
              <span className="text-sm">Ask Now</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] min-w-[730px] bg-primary">
            <CreateQuestionForm
              initialTopic={undefined}
              userId={""}
              handleFormSubmit={() => ''}
            />
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
};
