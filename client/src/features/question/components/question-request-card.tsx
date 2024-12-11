import { useNavigate } from "react-router-dom";

import { Question, User } from "@/types";

import { ChevronUp, ChevronDown, MessageSquare, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { useGetVotes } from "@/features/question/api/get-votes";
import { useCreateVote } from "@/features/question/api/vote";

interface QuestionCardProp {
  currentUserId: string;
  question: Question;
  requestedBy: User;
  requestedTo: User;
}

export const QuestionRequestCard = ({
  question,
  currentUserId,
  requestedBy,
}: QuestionCardProp) => {
  const navigate = useNavigate();
  const { data: votes } = useGetVotes({
    data: { userId: currentUserId.toString(), questionId: question.id },
  });
  const { mutate: createVote } = useCreateVote({});

  const handleCreateVote = (vote: "up" | "down") => {
    createVote({
      userId: currentUserId,
      questionId: question.id,
      vote,
    });
  };

  console.log(question);

  return (
    <Card className="w-full hover:shadow-2xl transition-shadow bg-primary duration-300 rounded-lg overflow-hidden dark:border-none text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          {/* Voting Section */}
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full hover:accent ${votes?.userVote === "up" ? "text-white bg-accent" : "text-gray-500"}`}
              onClick={() => handleCreateVote("up")}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span className="text-lg font-bold text-muted-foreground">
              {votes?.upvoteCount || 0}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full hover:accent ${votes?.userVote === "down" ? "text-white bg-accent" : "text-gray-500"}`}
              onClick={() => handleCreateVote("down")}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Question Details */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={requestedBy.attachment}
                    alt={requestedBy.name}
                  />
                  <AvatarFallback>
                    {question.createdBy.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-primary-foreground">
                      <span className="text-accent font-semibold">
                        {requestedBy.name}
                      </span>
                      <span> requested you to answer this question</span>
                    </p>
                    <span className="px-2 py-1 text-xs font-medium text-white bg-accent rounded-full">
                      Request
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    {new Date(question.createdAt).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "short", day: "numeric" },
                    )}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-sm px-4 py-1 bg-background text-primary-foreground hover:bg-accent border-primary transition-all"
                onClick={() => navigate(`/question/${question.id}`)}
              >
                Answer
              </Button>
            </div>

            {/* Question Content */}
            <div>
              <h3 className="text-xl font-semibold text-primary-foreground leading-snug mb-2">
                {question.title}
              </h3>
              <p
                className="text-sm text-muted-foreground line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: question.content || "<p>No content added yet</p>",
                }}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span>{question?.threads?.length || 0} answers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-400" />
                <span>10 views</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
