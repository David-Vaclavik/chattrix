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
import { Message } from "@/services/supabase/types/messages";

type ChatInputProps = {
  roomId: string;
  onSend: (message: { id: string; text: string }) => void;
  onSuccessSend: (message: Message) => void;
  onErrorSend: (id: string) => void;
  onHeightChange?: () => void;
};

export function ChatInput({
  roomId,
  onSend,
  onSuccessSend,
  onErrorSend,
  onHeightChange,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e?: React.SubmitEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (message.trim() === "") return;

    setMessage("");

    const id = crypto.randomUUID();
    onSend({ id, text: message });
    const result = await sendMessage(id, message, roomId);

    if (result.error) {
      toast.error("Failed to send message: " + result.message);
      onErrorSend(id);
      return;
    }

    onSuccessSend(result.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onHeightChange?.();
  };

  return (
    <form className="p-3" onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupTextarea
          placeholder="Type your message..."
          value={message}
          onChange={handleChange}
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
