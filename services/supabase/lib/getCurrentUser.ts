import { createClient } from "../server";

// maybe we can cache this???
export async function getCurrentUser() {
  const supabase = await createClient();

  return (await supabase.auth.getUser()).data.user;
}
