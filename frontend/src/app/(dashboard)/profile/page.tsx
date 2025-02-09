"use client";

import DashTitle from "../components/title";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditUserSchema, EditUser } from "@formhook/types";
import { useUser } from "@/providers/user";
import DataCard from "../components/data-card";

export default function ProfilePage() {
  const { user } = useUser();

  const form = useForm<EditUser>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  async function onSubmit(values: EditUser) {
    console.log(values);
  }

  const fields = [
    { name: "name", description: "Name", placeholder: user?.name || "Dris Elamri", type: "text" },
    { name: "email", description: "Email", placeholder: user?.email || "dris@formhook.com", type: "email" },
  ];

  return (
    <>
      <DashTitle title="Profile" />
      <DataCard
        title="Your account"
        description="Edit Profile"
        fields={fields}
        form={form}
        onSubmitAction={onSubmit}
      ></DataCard>
    </>
  );
}
