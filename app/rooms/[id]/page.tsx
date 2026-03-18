import { getCurrentUser } from "@/services/supabase/lib/getCurrentUser";
import { createAdminClient } from "@/services/supabase/server";
import { notFound, redirect } from "next/navigation";
import { RoomClient } from "./_client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [roomResult, user, messages] = await Promise.all([getRoom(id), getUser(), getMessages(id)]);

  if (roomResult.error === "not_found") return notFound();

  if (roomResult.error === "unauthenticated" || user == null) redirect("/auth/login");

  if (roomResult.error === "not_member") {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mb-8">You are not a member of this room</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return <RoomClient room={roomResult.data} user={user} messages={messages} />;
}

// Queries below used only in this file
async function getRoom(id: string) {
  const user = await getCurrentUser();
  if (user == null) return { data: null, error: "unauthenticated" as const };

  const supabase = await createAdminClient();

  const { data: roomExists } = await supabase.from("chat_room").select("id").eq("id", id).single();
  if (!roomExists) return { data: null, error: "not_found" as const };

  const { data: room, error } = await supabase
    .from("chat_room")
    .select("id, name, chat_room_member!inner()")
    .eq("id", id)
    .eq("chat_room_member.member_id", user.id)
    .single();

  if (error || !room) return { data: null, error: "not_member" as const };

  return { data: room, error: null };
}

async function getUser() {
  const user = await getCurrentUser();
  const supabase = await createAdminClient();
  if (user == null) return null;

  const { data, error } = await supabase
    .from("user_profile")
    .select("id, name, image_url")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data;
}

async function getMessages(roomId: string) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("message")
    .select("id, text, created_at, author_id, author:user_profile (name, image_url)")
    .eq("chat_room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) return [];
  return data;
}
