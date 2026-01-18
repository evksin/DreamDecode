"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDreamAction } from "@/actions/dreams";
import { Button } from "@/components/ui/Button";

export function DeleteDreamButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await deleteDreamAction(id);
          router.push("/");
        });
      }}
    >
      {pending ? "Удаляю..." : "Удалить"}
    </Button>
  );
}
