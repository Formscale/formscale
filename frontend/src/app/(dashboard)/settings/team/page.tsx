// export default function TeamPage() {
//   return <div>WIP</div>;

//   // table
//   // form, email, role, status, actions - revoke, transfer

//   // roles - viewer, admin, owner
//   // status - pending, active
//   // add member schema to prisma & form - replace from settings.admin
// }

"use client";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import { useDelete } from "@/hooks/use-delete";
import { useError, useForms, useUser } from "@/providers";
import { useState } from "react";

export default function TeamPage() {
  const { deleteItem } = useDelete();
  const { forms, refreshForms } = useForms();
  const [loading, setLoading] = useState(false);
  const { handleError, handleToast } = useError();
  const { user } = useUser();

  // async function handleCopy() {
  //   setLoading(true);
  //   handleToast("info", `Copying form to production...`);

  //   try {
  //     const data = await post("forms/:id/copy", null, { params: { id: form.id } });

  //     if (data.success && data.data?.form) {
  //       await updateUser({ ...user, development: false } as EditUser);

  //       handleToast("success", `Form copied to production`);

  //       await refreshForms();
  //       await refreshLogs();

  //       router.push(`/forms/${data.data?.form.id}`);
  //     }
  //   } catch (error) {
  //     handleError({
  //       message: "Failed to copy form to production",
  //       description: (error as Error).message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const columns = [
    {
      header: "Email",
      component: <span className="text-xs text-muted-foreground">Email</span>,
    },
    {
      header: "Form",
      component: <span className="text-xs text-muted-foreground">Form</span>,
    },
    {
      header: "Role",
      component: <span className="text-xs text-muted-foreground">Role</span>,
    },
    {
      header: "Status",
      component: <span className="text-xs text-muted-foreground">Status</span>,
    },
  ];

  return (
    <DataCardSkeleton title="Members">
      <div className="gap-2 flex w-full justify-between max-w-2xl items-start">
        {columns.map((column) => (
          <div key={column.header} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{column.header}</span>
          </div>
        ))}
      </div>
    </DataCardSkeleton>
  );
}
