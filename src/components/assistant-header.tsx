"use client";

import { useState } from "react";
import { Settings, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AssistantHeaderProps {
  assistantName: string;
  onNameChange: (newName: string) => void;
}

export function AssistantHeader({
  assistantName,
  onNameChange,
}: AssistantHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempName, setTempName] = useState(assistantName);

  const handleSave = () => {
    onNameChange(tempName);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Bot className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold font-headline">{assistantName}</h1>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Settings className="w-5 h-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customize Assistant</DialogTitle>
            <DialogDescription>
              Personalize your chat assistant.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apikey" className="text-right">
                API Key
              </Label>
              <Input
                id="apikey"
                type="password"
                placeholder="Using GOOGLE_API_KEY from .env"
                disabled
                className="col-span-3"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center col-span-4 px-4">
              To set your Gemini API Key, create a{" "}
              <code className="font-code p-1 bg-muted rounded-sm">
                .env.local
              </code>{" "}
              file with{" "}
              <code className="font-code p-1 bg-muted rounded-sm">
                GOOGLE_API_KEY=&lt;YOUR_API_KEY&gt;
              </code>
              .
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
