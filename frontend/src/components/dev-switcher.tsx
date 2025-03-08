"use client";

import { useError, useForms, useLogs, useUser } from "@/providers";
import { EditUser } from "@formscale/types";
import { Button } from "@formscale/ui/components";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import DefaultDropdown from "./default-dropdown";

export function DevBadge({ current = "dev" }: { current?: string }) {
  const bg = current === "dev" ? "bg-formscale/80" : "bg-success";

  return <div className={`w-2 h-2 rounded-full shadow-sm ${bg}`} />;
}

export function DevSwitcher() {
  const { user, updateUser, isLoading } = useUser();
  const [current, setCurrent] = useState("dev");
  const { handleToast } = useError();
  const { refreshForms } = useForms();
  const { refreshLogs } = useLogs();
  const router = useRouter();
  const pathname = usePathname();

  async function editMode(development: boolean) {
    if (user && development !== user.development) {
      await updateUser({ ...user, development } as EditUser);

      handleToast("success", `Switched to ${development ? "development" : "production"}`);

      await refreshForms();
      await refreshLogs();

      if (
        pathname !== "/logs" &&
        pathname !== "/forms" &&
        pathname !== "/submissions" &&
        pathname !== "/settings/team"
      ) {
        const segments = pathname.split("/").filter(Boolean);

        if (segments.length > 1) {
          router.push(`/${segments[0]}`);
        }
      }
    }
  }

  const items = [
    {
      value: "dev",
      title: "Development",
      icon: user?.development ? CheckIcon : undefined,
      onClick: () => editMode(true),
    },
    {
      value: "prod",
      title: "Production",
      icon: !user?.development ? CheckIcon : undefined,
      onClick: () => editMode(false),
    },
  ];

  useLayoutEffect(() => {
    if (user) {
      setCurrent(user.development ? "dev" : "prod");
    }
  }, [user]);

  return (
    <DefaultDropdown items={items}>
      <Button variant="outline" size="sm" disabled={isLoading} className="flex justify-center items-center">
        <DevBadge current={current} />
        {current === "dev" ? "Development" : "Production"}
        <CaretSortIcon className="-mr-1" />
      </Button>
    </DefaultDropdown>
  );
}
