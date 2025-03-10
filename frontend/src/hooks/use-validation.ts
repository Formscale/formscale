import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers";
import { useForm as useFormProvider } from "@/providers/form";
import { Field, TEMPLATES } from "@formscale/types";
import { useCallback, useState } from "react";

export function useValidation(formId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { put } = useFetch();
  const { handleError, handleToast } = useError();
  const { form, refreshForm } = useFormProvider();

  const updateValidation = useCallback(
    async (fields: Field[]) => {
      try {
        setIsLoading(true);

        const validationSettings = form?.settings.validation;

        const validation = {
          enabled: validationSettings?.enabled || false,
          explicit: validationSettings?.explicit || false,
          template: validationSettings?.template || TEMPLATES.CUSTOM,
          schema: validationSettings?.schema || {},
          fields,
        };

        const response = await put("forms/:id/edit/validation", validation, {
          params: { id: formId },
        });

        if (response.success && response.data?.form) {
          refreshForm();
          handleToast("success", "Form fields updated");
          return response.data.form;
        }
      } catch (err) {
        handleError({
          message: "Failed to update fields",
          description: (err as Error).message,
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [put, formId, form, handleError, handleToast, refreshForm]
  );

  const saveField = useCallback(
    async (field: Field) => {
      if (!form) return null;

      const existingFieldIndex = form.settings.validation.fields.findIndex((f: Field) => f.id === field.id);

      const fields = [...form.settings.validation.fields];

      if (existingFieldIndex >= 0) {
        fields[existingFieldIndex] = field;
      } else {
        fields.push(field);
      }

      return updateValidation(fields);
    },
    [form, updateValidation]
  );

  const removeField = useCallback(
    async (fieldId: string) => {
      if (!form) return null;

      const fields = form.settings.validation.fields.filter((field: Field) => field.id !== fieldId);

      return updateValidation(fields);
    },
    [form, updateValidation]
  );

  return {
    isLoading,
    saveField,
    removeField,
  };
}
