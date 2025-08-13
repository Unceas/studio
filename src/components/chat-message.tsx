import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./chat-assistant";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-background p-3 rounded-md my-2 overflow-x-auto text-sm font-code text-foreground">
    <code>{children}</code>
  </pre>
);

const renderMessageContent = (content: string) => {
  if (!content) return null;
  const parts = content.split(/(```(?:\w+\n)?[\s\S]*?```)/g);

  return parts
    .map((part, index) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```(?:\w*\n)?/g, "").replace(/```$/, "");
        return <CodeBlock key={index}>{code.trim()}</CodeBlock>;
      }
      return part ? <span key={index}>{part}</span> : null;
    })
    .filter(Boolean);
};

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex items-start gap-4 w-full",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex-shrink-0">
          <AvatarFallback>
            <Bot />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "p-3 px-4 rounded-2xl max-w-[80%]",
          isAssistant
            ? "bg-muted rounded-tl-none"
            : "bg-primary text-primary-foreground rounded-br-none"
        )}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2 p-1">
            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
          </div>
        ) : (
          <div className="text-sm break-words flex flex-col">
            {renderMessageContent(message.content)}
          </div>
        )}
      </div>
      {!isAssistant && (
        <Avatar className="w-8 h-8 bg-accent text-accent-foreground flex-shrink-0">
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
