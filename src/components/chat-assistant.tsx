"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { detectCodeAndRespond } from "@/ai/flows/detect-code-and-respond";

import { AssistantHeader } from "@/components/assistant-header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatForm } from "@/components/chat-form";
import { Card, CardContent } from "@/components/ui/card";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatAssistant() {
  const [assistantName, setAssistantName] = useState("Ayush Clone");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your personal AI assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNameChange = (newName: string) => {
    setAssistantName(newName);
    toast({
      title: "Success",
      description: `Assistant name changed to ${newName}.`,
    });
  };

  const handleSubmit = async ({ message }: { message: string }) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await detectCodeAndRespond({ prompt: message });
      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to get response from the assistant. Please check your API key and try again.",
      });
      // remove the user message if the call fails
      setMessages((prev) => prev.slice(0, prev.length - 1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl h-[90vh] shadow-2xl rounded-2xl flex flex-col bg-card">
      <AssistantHeader
        assistantName={assistantName}
        onNameChange={handleNameChange}
      />
      <CardContent className="flex-1 overflow-hidden p-0">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </CardContent>
      <div className="border-t p-4">
        <ChatForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </Card>
  );
}
