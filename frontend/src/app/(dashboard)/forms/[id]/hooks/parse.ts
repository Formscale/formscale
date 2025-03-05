import { Form, FormEdit } from "@formscale/types";

export default function parseForm(form: Form) {
  const formEdit: FormEdit = {
    id: form.id,
    name: form.name,
    development: form.development,
    settings: form.settings,
  };

  return formEdit;
}
