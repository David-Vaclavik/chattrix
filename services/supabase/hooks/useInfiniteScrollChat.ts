import { useState } from "react";
import { createClient } from "../client";
import { Message } from "../types/messages";

const LIMIT = 25;

// Used in: _client.tsx
export function useInfiniteScrollChat({
  startingMessages,
  roomId,
}: {
  startingMessages: Message[];
  roomId: string;
}) {
  const [messages, setMessages] = useState<Message[]>(startingMessages);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    startingMessages.length === 0 ? "done" : "idle"
  );

  const loadMoreMessages = async () => {
    if (status === "done" || status === "loading") return;
    const supabase = createClient();
    setStatus("loading");

    const { data, error } = await supabase
      .from("message")
      .select("id, text, created_at, author_id, author:user_profile (name, image_url)")
      .eq("chat_room_id", roomId)
      .lt("created_at", messages[0].created_at)
      .order("created_at", { ascending: false })
      .limit(LIMIT);

    if (error) {
      setStatus("error");
      return;
    }

    setMessages((prev) => [...data.toReversed(), ...prev]);
    setStatus(data.length < LIMIT ? "done" : "idle");
  };

  const triggerQueryRef = (node: HTMLDivElement | null) => {
    if (node == null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === node) {
            observer.unobserve(node);
            loadMoreMessages();
          }
        });
      },
      {
        rootMargin: "20px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  };

  return { loadMoreMessages, messages, status, triggerQueryRef };
}
