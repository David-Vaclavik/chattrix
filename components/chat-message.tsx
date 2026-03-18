import { DATE_FORMATTER } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Message } from "@/services/supabase/types/messages";
import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ChatMessage({
  text,
  author,
  author_id,
  created_at,
  status,
  ref,
}: Message & { status?: "pending" | "error" | "success"; ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("flex gap-4 px-4 py-2 hover:bg-accent/50", {
        "opacity-60": status === "pending",
        "bg-destructive/10 text-destructive": status === "error",
      })}
    >
      {/* User Avatar */}
      <div className="shrink-0 pt-1.25">
        <Link href={`/users/${author_id}`}>
          {author.image_url != null ? (
            <Image
              src={author.image_url}
              alt={author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="size-10 rounded-full flex items-center justify-center border bg-muted text-muted-foreground overflow-hidden">
              <UserRound className="size-7.5 mt-2.5" />
            </div>
          )}
        </Link>
      </div>

      {/* User message */}
      <div className="grow space-y-0.5">
        <div className="flex items-baseline gap-2">
          <Link href={`/users/${author_id}`} className="hover:underline leading-none">
            <span className="text-base font-semibold">{author.name}</span>
          </Link>
          <span className="text-xs text-muted-foreground">
            {DATE_FORMATTER.format(new Date(created_at))}
          </span>
        </div>
        <p className="text-base wrap-break-words whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}
