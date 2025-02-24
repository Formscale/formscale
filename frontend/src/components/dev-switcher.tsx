"use client";

import { useError, useUser } from "@/providers";
import { EditUser } from "@formhook/types";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useLayoutEffect, useState } from "react";
import DefaultDropdown from "./default-dropdown";
import { Button } from "./ui/button";

export function DevSwitcher() {
  const { user, updateUser, isLoading } = useUser();
  const [current, setCurrent] = useState("dev");
  const { handleToast } = useError();

  async function editMode(development: boolean) {
    if (user && development !== user.development) {
      await updateUser({ ...user, development } as EditUser);

      handleToast("success", "Switching to " + (development ? "development" : "production"));

      setTimeout(() => {
        // should refetch forms instead of reloading page (convert useForms to provider)
        window.location.reload();
      }, 750);
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
        {current === "dev" ? "Development" : "Production"}
        <CaretSortIcon className="-mr-1" />
      </Button>
    </DefaultDropdown>
  );
}
