import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";
import { createAdminClient } from "@/services/supabase/server";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserProfile(id);

  if (user == null) return notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
          {user.image_url != null ? (
            <div className="relative size-64 rounded-full overflow-hidden border mb-8">
              <Image
                src={user.image_url}
                alt={user.name}
                fill
                sizes="256px"
                loading="eager"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="size-64 rounded-full flex items-center justify-center border bg-muted text-muted-foreground overflow-hidden mb-8">
              <UserRound className="size-48" />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
          <h2 className="text-sm text-muted-foreground">
            User ID: <CopyButton text={user.id} />
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}

async function getUserProfile(id: string) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("user_profile")
    .select("id, name, image_url")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
