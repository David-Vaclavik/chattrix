"use client";

import { LogoutButton } from "@/services/supabase/components/logout-button";
import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, isLoading } = useCurrentUser();

  return (
    <div className="border-b bg-background h-header">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center h-full gap-4">
        <Link href="/" className="text-xl font-bold">
          Chattrix
        </Link>

        {isLoading || user === null ? null : null}

        {isLoading || user == null ? (
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user.user_metadata?.preferred_username || user.email}
            </span>
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
}
