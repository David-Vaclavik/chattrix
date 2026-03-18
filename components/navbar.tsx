"use client";

import { LogoutButton } from "@/services/supabase/components/logout-button";
import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Navbar() {
  const { user, isLoading } = useCurrentUser();
  const userName = user?.user_metadata?.preferred_username || user?.email || "User";

  return (
    <div className="border-b bg-background h-header">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center h-full gap-4">
        <Link href="/" className="text-2xl font-bold">
          Chattrix
        </Link>

        {isLoading || user == null ? (
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <Link href={`/users/${user.id}`} className="flex items-center gap-2">
              <Image
                src={user.user_metadata?.avatar_url}
                alt={userName}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm text-muted-foreground">{userName}</span>
            </Link>
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
}
