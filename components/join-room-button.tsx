"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/services/supabase/client";
import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function JoinRoomButton({
  roomId,
  ...props
}: React.ComponentProps<typeof Button> & { roomId: string }) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleJoin = async () => {
    if (!user) {
      return { error: true, message: "You must be logged in to join a room." };
    }

    const supabase = createClient();
    const { error } = await supabase.from("chat_room_member").insert({
      chat_room_id: roomId,
      member_id: user.id,
    });

    if (error) {
      return { error: true, message: "Failed to join room" };
    }

    router.refresh();
    router.push(`/rooms/${roomId}`);

    return { error: false };
  };

  const performAction = () => {
    startTransition(async () => {
      const data = await handleJoin();
      if (data.error) toast.error(data.message ?? "Error");
    });
  };

  return (
    <Button {...props} onClick={performAction} disabled={isPending}>
      {isPending && <Loader2Icon className="animate-spin" />}
      {isPending ? null : "Join"}
    </Button>
  );
}
