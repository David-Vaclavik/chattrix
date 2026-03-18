"use server";

import z from "zod";
import { createRoomSchema } from "@/services/supabase/schemas/rooms";
import { getCurrentUser } from "../lib/getCurrentUser";
import { createAdminClient } from "../server";
import { redirect } from "next/dist/client/components/navigation";

export async function createRoom(unsafeData: z.infer<typeof createRoomSchema>) {
  const { success, data } = createRoomSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Invalid data" };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not authenticated" };
  }

  const supabase = await createAdminClient();

  const { data: room, error: roomError } = await supabase
    .from("chat_room")
    .insert({
      name: data.name,
      is_public: data.isPublic,
    })
    .select("id")
    .single();

  if (roomError || !room) {
    return { error: true, message: roomError?.message || "Failed to create room" };
  }

  const { error: membershipError } = await supabase.from("chat_room_member").insert({
    chat_room_id: room.id,
    member_id: user.id,
  });

  if (membershipError) {
    console.error(membershipError);
    return { error: true, message: membershipError?.message || "Failed to add user to room" };
  }

  redirect(`/rooms/${room.id}`);
}

export async function addUserToRoom({ roomId, userId }: { roomId: string; userId: string }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: true, message: "User not authenticated" };
  }

  const supabase = await createAdminClient();

  const { data: roomMembership, error: membershipError } = await supabase
    .from("chat_room_member")
    .select("member_id")
    .eq("chat_room_id", roomId)
    .eq("member_id", currentUser.id)
    .single();

  if (membershipError || !roomMembership) {
    return { error: true, message: "You are not a member of this chat room" };
  }

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  const { data: userProfile } = await supabase
    .from("user_profile")
    .select("id")
    .eq(isUUID ? "id" : "name", userId)
    .single();

  if (!userProfile) {
    return { error: true, message: "User not found" };
  }

  const { data: existingMembership } = await supabase
    .from("chat_room_member")
    .select("member_id")
    .eq("chat_room_id", roomId)
    .eq("member_id", userProfile.id)
    .single();

  if (existingMembership) {
    return { error: true, message: "User is already a member of this chat room" };
  }

  const { error: insertError } = await supabase.from("chat_room_member").insert({
    chat_room_id: roomId,
    member_id: userProfile.id,
  });

  if (insertError) {
    return { error: true, message: insertError.message };
  }

  return { error: false, message: "User added to room successfully" };
}
