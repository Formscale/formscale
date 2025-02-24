"use client";

import Loading from "@/components/loading";
import { useUser } from "@/providers/user";
import { EditUser, EditUserSchema } from "@formhook/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import DataCard from "../components/data-card";
import DashTitle from "../components/title";

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useUser();

  const form = useForm<EditUser>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: "",
      email: "",
      development: true,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        development: user.development,
      });
    }
  }, [user, form]);

  async function onSubmit(values: EditUser) {
    // console.log(values);

    await updateUser(values);
  }

  const fields = [
    { name: "name", description: "Name", placeholder: user?.name || "Dris Elamri", type: "text" },
    {
      name: "email",
      description: "Email",
      placeholder: user?.email || "dris@formscale.dev",
      type: "email",
      disabled: true,
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <>
      <DashTitle title="Profile" />
      <DataCard
        title="Your account"
        description="Save Profile"
        fields={fields}
        form={form}
        disabled={isLoading}
        onSubmitAction={onSubmit}
      ></DataCard>
    </>
  );
}
