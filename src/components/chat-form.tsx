"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface ChatFormProps {
  onSubmit: (values: { message: string }) => Promise<void>;
  isLoading: boolean;
}

const formSchema = z.object({
  message: z.string().min(1),
});

export function ChatForm({ onSubmit, isLoading }: ChatFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (form.getValues("message").trim()) {
        form.handleSubmit(wrappedOnSubmit)();
      }
    }
  };

  const wrappedOnSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(wrappedOnSubmit)}
        className="flex items-center gap-4"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Type your message..."
                  className="resize-none"
                  rows={1}
                  disabled={isLoading}
                  onKeyDown={handleKeyDown}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !form.watch("message").trim()}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          aria-label="Send message"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </form>
    </Form>
  );
}
