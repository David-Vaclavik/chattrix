"use client";

import { SendIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { useState } from "react";
import { toast } from "sonner";
import { sendMessage } from "@/services/supabase/actions/messages";

export function ChatInput({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (message.trim() === "") return;

    setMessage("");
    const result = await sendMessage(message, roomId);

    if (result.error) {
      toast.error("Failed to send message: " + result.message);
      return;
    }

    // TODO: Handle success
  };

  return (
    <form className="p-3" onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupTextarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field-sizing-content min-h-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <InputGroupAddon align={"inline-end"}>
          <InputGroupButton type="submit" size={"icon-sm"}>
            <SendIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
