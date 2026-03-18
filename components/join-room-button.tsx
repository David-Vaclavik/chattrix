"use client";

import { Button } from "@/components/ui/button";
import { joinRoom } from "@/services/supabase/actions/rooms";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function JoinRoomButton({
  roomId,
  ...props
}: React.ComponentProps<typeof Button> & { roomId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleJoin = async () => {
    const data = await joinRoom(roomId);
    if (data.error) return data;

    router.push(`/rooms/${roomId}`);

    return { error: false };
  };

  const performAction = () => {
    startTransition(async () => {
      const data = await handleJoin();
      if (data.error) toast.error(data.message ?? "Unknown Error");
    });
  };

  return (
    <Button {...props} onClick={performAction} disabled={isPending}>
      {isPending && <Loader2Icon className="animate-spin" />}
      {isPending ? null : "Join"}
    </Button>
  );
}
