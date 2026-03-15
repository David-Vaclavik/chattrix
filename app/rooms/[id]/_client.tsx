"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { InviteUserModal } from "@/components/invite-user-modal";
import { useRealtimeChat } from "@/services/supabase/hooks/useRealtimeChat";
import { Message } from "@/services/supabase/types/messages";
import { useEffect, useRef, useState } from "react";

type RoomClientProps = {
  user: {
    id: string;
    name: string;
    image_url: string | null;
  };
  room: {
    id: string;
    name: string;
  };
  messages: Message[];
};

export function RoomClient({ room, user, messages }: RoomClientProps) {
  const { connectedUsers, messages: realtimeMessages } = useRealtimeChat(room.id, user.id);
  const [sentMessages, setSentMessages] = useState<
    (Message & { status: "pending" | "error" | "success" })[]
  >([]);

  const allMessages = messages.toReversed().concat(
    realtimeMessages,
    sentMessages.filter((m) => !realtimeMessages.find((rm) => rm.id === m.id))
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [allMessages.length]);

  const handleSend = (message: { id: string; text: string }) => {
    setSentMessages((prev) => [
      ...prev,
      {
        id: message.id,
        text: message.text,
        created_at: new Date().toISOString(),
        author_id: user.id,
        author: { name: user.name, image_url: user.image_url },
        status: "pending",
      },
    ]);
  };

  const handleSuccessSend = (message: Message) => {
    setSentMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...message, status: "success" } : m))
    );
  };

  const handleErrorSend = (id: string) => {
    setSentMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "error" } : m)));
  };

  return (
    <div className="container mx-auto h-screen-with-header border border-y-0 flex flex-col">
      {/* Header of the chat */}
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="border-b">
          <h1 className="text-2xl font-bold">{room.name}</h1>
          <p className="text-muted-foreground text-sm">
            {connectedUsers === 1 ? "1 user online" : `${connectedUsers} users online`}
          </p>
        </div>
        <InviteUserModal roomId={room.id} />
      </div>

      {/* Messages */}
      <div
        className="grow overflow-y-auto flex flex-col-reverse"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        <div>
          {allMessages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ChatInput */}
      <ChatInput
        roomId={room.id}
        onSend={handleSend}
        onSuccessSend={handleSuccessSend}
        onErrorSend={handleErrorSend}
      />
    </div>
  );
}
