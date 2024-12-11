import { useState } from "react";
import { Question, User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SelectRequest } from "./select-request";
import { useCreateThread } from "@/features/shared/api/create-thread";
import { MessageSquare, Eye, ChevronUp, ChevronDown, Share2 } from 'lucide-react';
import { CreateQuestionForm } from "@/features/shared/components/create-question-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { getQuestionQueryOptions } from "../api/get-question";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetVotes } from "../api/get-votes";
import { useCreateVote } from "../api/vote";

interface QuestionViewCardProp {
  currentUser: User;
  question: Question;
}

export const QuestionViewCard = ({
  currentUser,
  question,
}: QuestionViewCardProp) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: votes } = useGetVotes({
    data: { userId: currentUser.id.toString(), questionId: question.id },
  });
  
  const { mutate: createVote } = useCreateVote({});
  const handleCreateVote = (vote: "up" | "down") => {
    createVote({
      userId: currentUser.id.toString(),
      questionId: question.id,
      vote,
    });
  };

  return (
    <Card className="w-full bg-card  shadow-lg hover:shadow-xl dark:border-none transition-shadow duration-300">
      <CardContent className="p-6 bg-primary rounded-lg">
        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <>
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
                  </>
                </TooltipTrigger>
                <TooltipContent>Upvote</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* <span className="text-xl font-bold text-primary">{voteCount}</span> */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full hover:accent ${votes?.userVote === "down" ? "text-white bg-accent" : "text-gray-500"}`}
                    onClick={() => handleCreateVote("down")}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Downvote</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-primary-foreground mb-2">{question.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {question.topic !== null && (
              <Badge variant="secondary" className="px-2 py-1 flex items-center gap-2 text-xs font-semibold">
                <img
                    src={question?.topic?.attachment}
                    alt={`${question?.topic?.name} icon`}
                    className="w-4 h-4 rounded-full"
                  />
                <span>{question.topic?.name}</span>
              </Badge>
              )}
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{question.threads?.length || 0} answers</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="text-sm">10 views</span>
              </div>
            </div>
            <AnimatePresence>
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : "100px" }}
                className="prose dark:prose-invert max-w-none overflow-hidden"
              >
                <div
                  className="text-muted-foreground text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: question.content }}
                ></div>
              </motion.div>
            </AnimatePresence>
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-0 px-0 text-primary-foreground  text-sm hover:text-primary-foreground hover:bg-primary transition-colors duration-200"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <Separator className="my-0" />
      <CardFooter className="flex justify-between items-center rounded-md bg-primary px-6 py-2">
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="rounded-full text-sm bg-background">Request Answer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-primary dark:border-none">
              <SelectRequest
                questionId={question.id}
                currentUserId={currentUser.id}
              />
            </DialogContent>
          </Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-none"  >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <AnswerPrompt question={question} user={currentUser} />
      </CardFooter>
    </Card>
  );
};

interface AnswerPromptProps {
  user: User;
  question: Question;
}

const AnswerPrompt = ({ user, question }: AnswerPromptProps) => {
  const queryClient = useQueryClient();

  const { mutate: createThread } = useCreateThread({
    mutationConfig: {
      onSuccess: (data) => {
        console.log("new thread answer: " + JSON.stringify(data, null, 2));
        queryClient.invalidateQueries({
          queryKey: getQuestionQueryOptions(data.questionId || "").queryKey,
        });
      },
    },
  });

  const handleCreateThread = (data: FormData) => {
    data.append("questionId", question.id);
    createThread(data);
  };

  return (
    <div className="flex items-center space-x-4 bg-background rounded-full px-4 py-2 hover:bg-secondary transition-colors duration-200">
      <Avatar className="h-8 w-8 ring-2 ring-primary">
        <AvatarImage src={user.attachment} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <p className="font-medium text-primary-foreground text-sm">
          {user.name}, share your expertise
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="rounded-full text-accent-foreground text-sm">Answer</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] bg-primary dark:border-none">
          <CreateQuestionForm
            initialTopic={question.topic}
            initialTitleVal={question.title}
            userId={user.id}
            handleFormSubmit={handleCreateThread}
            taggable
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

