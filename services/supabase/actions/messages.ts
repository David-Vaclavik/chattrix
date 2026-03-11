"use server";

import { getCurrentUser } from "../lib/getCurrentUser";
import { createAdminClient } from "../server";
import { Message } from "../types/messages";

type SendMessageResult = { error: false; data: Message } | { error: true; message: string };

export async function sendMessage(message: string, roomId: string): Promise<SendMessageResult> {
  // Implement the logic to send a message using Supabase
  const user = await getCurrentUser();
  if (!user) {
    return { error: true, message: "User not authenticated" };
  }

  if (!message.trim()) {
    return { error: true, message: "Message cannot be empty" };
  }

  const supabase = await createAdminClient();

  const { data: membership, error: membershipError } = await supabase
    .from("chat_room_member")
    .select("member_id")
    .eq("chat_room_id", roomId)
    .eq("member_id", user.id)
    .single();

  if (membershipError || !membership) {
    return { error: true, message: "User is not a member of this chat room" };
  }

  const { data, error } = await supabase
    .from("message")
    .insert({
      text: message.trim(),
      chat_room_id: roomId,
      author_id: user.id,
    })
    .select("id, text, created_at, author_id, author:user_profile (name, image_url)")
    .single();

  if (error) {
    return { error: true, message: error.message };
  }

  return { error: false, data };
}
