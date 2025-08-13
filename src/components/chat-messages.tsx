import { useEffect, useRef } from "react";
import type { Message } from "@/components/chat-assistant";
import { ChatMessage } from "@/components/chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6" ref={viewportRef}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <ChatMessage message={{ role: "assistant", content: "" }} isLoading={true} />
        )}
      </div>
    </ScrollArea>
  );
}
