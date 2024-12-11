import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Thread } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Tag } from "lucide-react";
import { TbArrowBigDown } from "react-icons/tb";
import { sanitizeContent } from "@/utils";

interface ThreadSearchResultsProps {
  results: Thread[];
  onSelectThread: () => void;
}

export const ThreadSearchResults: React.FC<ThreadSearchResultsProps> = ({
  results,
  onSelectThread,
}) => {
  const navigate = useNavigate();

  const sanitized = (content: string) => {
    return content.length < 150 ? content : content.substring(0, 150) + "...";
  };

  return (
    <Card className="absolute top-full left-0 w-full mt-1 shadow-lg z-50 bg-primary dark:border-gray-600">
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No results found
            </p>
          ) : (
            <ul className="py-2">
              {results.map((thread) => (
                <li
                  key={thread.id}
                  className="hover:bg-accent/10 transition-colors"
                >
                  <button
                    className="w-full px-4 py-3 text-left flex items-start gap-3"
                    onClick={() => {
                      navigate(`/thread/${thread.id}`);
                      onSelectThread();
                    }}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={thread.createdBy.attachment}
                        alt={thread.createdBy.name}
                      />
                      <AvatarFallback>
                        {thread.createdBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 max-w-[150px]">
                      <h3 className="text-sm font-medium text-primary-foreground truncate">
                        {thread.title}
                      </h3>
                      <p
                        className="text-xs text-muted-foreground mt-1 truncate"
                        dangerouslySetInnerHTML={{
                          __html:
                            sanitized(sanitizeContent(thread.content)) ||
                            "<p>No content added yet</p>",
                        }}
                      />
                      <div className="flex items-center gap-4 mt-2 text-primary-foreground">
                        <span className="flex items-center gap-1 text-xs ">
                          <TbArrowBigDown className="h-4 w-4 rotate-180" />
                          {thread.likeCount}
                        </span>
                        <span className="flex items-center gap-1 text-xs ">
                          <TbArrowBigDown className="h-4 w-4" />
                          {thread.dislikeCount}
                        </span>
                        <span className="flex items-center gap-1 text-xs ">
                          <MessageSquare className="w-3 h-3" />
                          {thread.commentCount}
                        </span>
                      </div>
                    </div>
                    {thread.tags && thread.tags.length > 0 && (
                      <div className="flex items-center gap-1 ml-auto">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {thread.tags[0].name}
                        </span>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
