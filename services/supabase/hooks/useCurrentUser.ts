import { useEffect, useState } from "react";
import { createClient } from "../client";
import { User } from "@supabase/supabase-js";

// Used in: navbar, join-room-button, leave-room-button
export function useCurrentUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        // console.log("Current user:", data.user);
        setUser(data.user);
      })
      .finally(() => setIsLoading(false));

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      // console.log("Auth state changed:", _, session);
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
