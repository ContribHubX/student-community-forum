import { useEffect } from "react";

import { Thread } from "@/types";
import { ThreadCard } from "./thread-card";

import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { useAuth } from "@/hooks/use-auth";

interface ThreadViewProps {
  thread: Thread;
}

export const ThreadView = ({ thread }: ThreadViewProps) => {
  const { authState } = useAuth();


  useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre code.ql-syntax");
    console.log(codeBlocks);
    codeBlocks.forEach((block) => {
      const blockElement = block as HTMLElement;
      hljs.highlightElement(blockElement);
    });
  }, [thread?.content]);


  return (
    <div className="">
      <ThreadCard 
        thread={thread}
        userId={authState.user?.id || ""}
      />
    </div>
  );
};



