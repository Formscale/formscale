import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import { DeleteDialog } from "@/components/default-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useFetch } from "@/hooks/fetch";
import { useDelete } from "@/hooks/use-delete";
import { useError, useForms, useLogs, useUser } from "@/providers";
import { EditUser, Form } from "@formhook/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DangerCard({ form }: { form: Form }) {
  const { deleteItem } = useDelete();
  const { refreshForms } = useForms();
  const router = useRouter();
  const { post } = useFetch();
  const [loading, setLoading] = useState(false);
  const { handleError, handleToast } = useError();
  const { user, updateUser } = useUser();
  const { refreshLogs } = useLogs();

  async function handleCopy() {
    setLoading(true);
    handleToast("info", `Copying form to production...`);

    try {
      const data = await post("forms/:id/copy", null, { params: { id: form.id } });

      if (data.success && data.data?.form) {
        await updateUser({ ...user, development: false } as EditUser);

        handleToast("success", `Form copied to production`);

        await refreshForms();
        await refreshLogs();

        router.push(`/forms/${data.data?.form.id}`);
      }
    } catch (error) {
      handleError({
        message: "Failed to copy form to production",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DataCardSkeleton
      title="Danger"
      button={
        <>
          {form.development && (
            <Button size="sm" onClick={handleCopy} disabled={loading}>
              <span className="text-xs font-bold">Copy to Production</span>
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <span className="text-xs font-bold">Delete Form</span>
              </Button>
            </DialogTrigger>
            <DeleteDialog
              title={`Delete ${form.name}?`}
              buttonText={`Delete Form & All Associated Data`}
              onDeleteAction={async () => {
                return await deleteItem(
                  "forms/:id/delete",
                  { id: form.id },
                  {
                    onSuccess: async () => {
                      refreshForms();
                      router.push("/forms");
                    },
                  }
                );
              }}
            />
          </Dialog>
        </>
      }
    >
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <span className="text-[0.8rem]">{form.development ? "Production" : "Delete"}</span>

          <span className="text-xs text-muted-foreground">
            {form.development
              ? "In development, an allowed origin is required to receive submissions & integration errors will lead to early returns."
              : "All data from this form, including submissions, file uploads, and logs, will be permanently deleted."}
          </span>
        </div>
      </div>
    </DataCardSkeleton>
  );
}
