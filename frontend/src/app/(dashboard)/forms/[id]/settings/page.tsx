"use client";

import Settings from "./settings";
import { useForm } from "@/providers";

export default function SettingsPage() {
  const { form } = useForm();

  if (!form) return null;

  return <Settings form={form} />;
}
