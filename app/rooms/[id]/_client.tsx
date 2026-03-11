"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { Message } from "@/services/supabase/types/messages";

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
  return (
    <div className="container mx-auto h-screen-with-header border border-y-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="border-b">
          <h1 className="text-2xl font-bold">{room.name}</h1>
          <p className="text-muted-foreground text-sm">
            0 users online
            {/* TODO: add online users */}
          </p>
        </div>
        {/* <InviteUserModal roomId={room.id} /> */}
      </div>

      {/* TODO: Not real-time yet */}
      <div
        className="grow overflow-y-auto flex flex-col-reverse"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        <div>
          {messages.toReversed().map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
        </div>
      </div>

      {/* ChatInput */}
      <ChatInput roomId={room.id} />
    </div>
  );
}
