"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { InviteUserModal } from "@/components/invite-user-modal";
import { Button } from "@/components/ui/button";
import { useInfiniteScrollChat } from "@/services/supabase/hooks/useInfiniteScrollChat";
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
  const {
    loadMoreMessages,
    messages: oldMessages,
    status,
    triggerQueryRef,
  } = useInfiniteScrollChat({ startingMessages: messages.toReversed(), roomId: room.id });
  const { connectedUsers, messages: realtimeMessages } = useRealtimeChat(room.id, user.id);
  const [sentMessages, setSentMessages] = useState<
    (Message & { status: "pending" | "error" | "success" })[]
  >([]);

  const allMessages = oldMessages.concat(
    realtimeMessages,
    sentMessages.filter((m) => !realtimeMessages.find((rm) => rm.id === m.id))
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const lenghtOfNewMessages = realtimeMessages.length + sentMessages.length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [lenghtOfNewMessages]);

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
    <div className="container mx-auto max-w-4xl h-screen-with-header border border-y-0 flex flex-col">
      {/* Header of the chat */}
      <div className="flex items-center justify-between gap-2 p-4 sticky top-(--height-header) z-10 bg-background">
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
          {status === "loading" && (
            <p className="text-center text-sm text-muted-foreground py-2">
              Loading more messages...
            </p>
          )}
          {status === "error" && (
            <div className="text-center p-4 pt-0 space-y-2">
              <p className="text-sm text-destructive py-2">Error loading messages.</p>
              <Button onClick={loadMoreMessages} variant="outline">
                Retry
              </Button>
            </div>
          )}
          {allMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              {...message}
              ref={index === 0 && status === "idle" ? triggerQueryRef : null}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ChatInput */}
      <div className="sticky bottom-0 bg-background">
        <ChatInput
          roomId={room.id}
          onSend={handleSend}
          onSuccessSend={handleSuccessSend}
          onErrorSend={handleErrorSend}
          onHeightChange={() => bottomRef.current?.scrollIntoView({ behavior: "instant" })}
        />
      </div>
    </div>
  );
}
