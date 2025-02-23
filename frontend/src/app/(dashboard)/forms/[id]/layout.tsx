import { FormProvider } from "@/providers/form";
import FormLayoutContent from "./overview";

export default async function FormLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const { id } = await params;

  return (
    <FormProvider formId={id}>
      <FormLayoutContent id={id}>{children}</FormLayoutContent>
    </FormProvider>
  );
}
