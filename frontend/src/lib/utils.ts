import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleCopy(text: string, type?: string) {
  navigator.clipboard.writeText(text);

  const message = type ? `${type} copied to clipboard` : "Copied to clipboard";
  toast.success(message);
}
