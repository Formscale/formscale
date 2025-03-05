"use client";

import Loading from "@/components/loading";
import { useError } from "@/providers/error";
import { useUser } from "@/providers/user";
import { EditUser, EditUserSchema } from "@formscale/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import DataCard from "../components/data-card";
import DashTitle from "../components/title";

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useUser();
  const { handleToast } = useError();

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
        twoFactor: user.twoFactor,
      });
    }
  }, [user, form]);

  async function onSubmit(values: EditUser) {
    // console.log(values);

    await updateUser(values);
    // handleToast("success", "Profile updated successfully");
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

  const twoFactorField = {
    name: "twoFactor",
    description: "Enabled",
    placeholder: "false",
    type: "switch",
    children: (
      <p className="text-xs text-muted-foreground">
        2FA secures your account by sending a code to your email before logging in.
      </p>
    ),
  };

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
      <DataCard
        title="Two-Factor Auth (2FA)"
        description={`${user?.twoFactor ? "Disable" : "Enable"} 2FA`}
        fields={[twoFactorField]}
        form={form}
        disabled={isLoading}
        onSubmitAction={onSubmit}
      ></DataCard>
    </>
  );
}
