import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mb-4">This page could not be found.</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
