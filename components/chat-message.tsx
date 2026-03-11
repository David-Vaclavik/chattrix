import { Message } from "@/services/supabase/types/messages";
import { UserRound } from "lucide-react";
import Image from "next/image";

// TODO: Add env variable for date format
const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  timeStyle: "short",
});

export function ChatMessage({ text, author, created_at }: Message) {
  return (
    <div className="flex gap-4 px-4 py-2 hover:bg-accent/50 ">
      {/* User Avatar */}
      <div className="shrink-0">
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
      </div>

      {/* User message */}
      <div className="grow space-y-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{author.name}</span>
          <span className="text-xs text-muted-foreground">
            {DATE_FORMATTER.format(new Date(created_at))}
          </span>
        </div>
        <p className="text-sm wrap-break-words whitespace-pre">{text}</p>
      </div>
    </div>
  );
}
