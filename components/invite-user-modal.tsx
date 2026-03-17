"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2Icon, UserPlusIcon } from "lucide-react";
import { addUserToRoom } from "@/services/supabase/actions/rooms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  userId: z.string().min(1).trim(),
});

type FormData = z.infer<typeof formSchema>;

export function InviteUserModal({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  async function onSubmit(data: FormData) {
    const response = await addUserToRoom({ roomId, userId: data.userId });

    if (response.error) {
      toast.error(response.message);
    } else {
      setOpen(false);
      router.refresh();
      toast.success(response.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlusIcon className="w-4 h-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User to Room</DialogTitle>
          <DialogDescription>
            Enter the user ID or username of the person you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="userId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-id">User ID or Username</FieldLabel>
                  <Input {...field} id="user-id" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field orientation="horizontal" className="w-full">
              <Button type="submit" disabled={form.formState.isSubmitting} className="grow">
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  "Invite User"
                )}
              </Button>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
