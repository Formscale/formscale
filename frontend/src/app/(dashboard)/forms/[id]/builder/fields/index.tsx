export const baseFields = [
  {
    name: "name",
    type: "text",
    description: "Field Name",
    placeholder: "name",
    children: <span className="text-xs text-muted-foreground">Used for the "name" attribute in your form.</span>,
  },
  // {
  //   name: "placeholder",
  //   type: "text",
  //   description: "Placeholder",
  //   placeholder: "Dris Elamri",
  // },
  // {
  //   name: "description",
  //   type: "text",
  //   description: "Description",
  //   placeholder: "Your name",
  // },
];

export const requiredFields = [
  {
    name: "required",
    type: "switch",
    description: "Required",
    placeholder: "true",
  },
];
