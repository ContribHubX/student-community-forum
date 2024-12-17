import { FaStar } from "react-icons/fa";
import { useGetPendingRequest } from "../api/get-pending-request";
import { QuestionRequestCard } from "./question-request-card";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { GiMailbox } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

interface QuestionRequestCardListProp {
  user: User | undefined;
}

export const QuestionRequestCardList = ({
  user,
}: QuestionRequestCardListProp) => {
  const { data: request } = useGetPendingRequest({ userId: user?.id || "" });

  return (
    <div>
      <div className="text-primary-foreground flex items-center gap-4 bg-primary rounded-md p-3 mb-4 shadow-md">
        <div className="rounded-md h-[30px] w-[30px] flex items-center justify-center bg-accent">
          <FaStar className="text-lg text-accent-foreground" />
        </div>
        <p className="text-sm font-medium">Questions for you</p>
      </div>

      <div className="flex flex-col  gap-4 rounded-md ">
        {request?.length ? (
          request?.map((req) => (
            <QuestionRequestCard
              question={req.question}
              requestedBy={req.requestedBy}
              requestedTo={req.requestedTo}
              currentUserId={user?.id || ""}
            />
          ))
        ) : (
          <EmptyRequest />
        )}
      </div>
    </div>
  );
};

export const EmptyRequest = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 items-center justify-center text-primary-foreground px-20 my-auto py-10">
      <GiMailbox className="text-6xl font-semibold" />
      <h1 className="text-xl font-semibold">Answer Request</h1>
      <p className="text-sm text-muted-foreground text-center">
        Ask for answers from other users by clicking Request Answer on a
        question. Requests you receive will show up here.
      </p>
      <Button
        onClick={() => navigate("/question")}
        className="text-sm font-normal mt-4 text-accent-foreground"
      >
        See Top Questions
      </Button>
    </div>
  );
};
