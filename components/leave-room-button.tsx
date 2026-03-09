"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/services/supabase/client";
import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function LeaveRoomButton({
  roomId,
  ...props
}: React.ComponentProps<typeof Button> & { roomId: string }) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLeave = async () => {
    if (!user) {
      return { error: true, message: "You must be logged in to leave a room." };
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("chat_room_member")
      .delete()
      .eq("chat_room_id", roomId)
      .eq("member_id", user.id);

    if (error) {
      return { error: true, message: "Failed to leave room" };
    }

    router.refresh();

    return { error: false };
  };

  const performAction = () => {
    startTransition(async () => {
      const data = await handleLeave();
      if (data.error) toast.error(data.message ?? "Error");
    });
  };

  return (
    <Button {...props} onClick={performAction} disabled={isPending}>
      {isPending && <Loader2Icon className="animate-spin" />}
      {isPending ? null : "Leave"}
    </Button>
  );
}
