import { FieldValues, UseFormReturn } from "react-hook-form";

export interface FormPartProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: string;
  type: string;
  description?: string;
  placeholder: string;
  muted?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  options?: string[];
}

export interface FormField {
  name: string;
  description?: string;
  placeholder: string;
  type: string;
  options?: string[];

  id?: string;
  required?: boolean;
  multiple?: boolean;
  muted?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  options?: string[];
  min?: number | "";
  max?: number | "";
  minSelected?: number;
  maxSelected?: number;
}

export interface FormSkeletonProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmitAction?: (values: T) => void | Promise<void>;
  fields?: FormField[];
  buttonText?: string;
  button?: React.ReactNode;
  disabled?: boolean;
  ignoreDirty?: boolean;
  children?: React.ReactNode;
  className?: string;
}
