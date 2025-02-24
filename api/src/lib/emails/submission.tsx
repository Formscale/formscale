/** @jsxImportSource react */

import { Form, SubmissionSent } from "@formhook/types";
import { Section, Text } from "@react-email/components";
import { BaseEmail } from "./base";

interface SubmissionEmailProps {
  form: Form;
  submission: SubmissionSent;
  env: Env;
}

export const SubmissionEmail = ({ form, submission, env }: SubmissionEmailProps) => {
  console.log("form", form);
  console.log("submission", submission);

  return (
    <BaseEmail
      title={`New submission on ${form.name}`}
      description={"A new submission has been made on " + form.name}
      footer={
        "You're receiving this because you've confirmed your email on Formscale and email notifications are enabled."
      }
      env={env}
    >
      <Section>
        <Text>{submission.data.name}</Text>
      </Section>
    </BaseEmail>
  );
};

SubmissionEmail.PreviewProps = {
  form: {
    name: "Test Form",
  },
  submission: {
    data: {
      name: "John Doe",
    },
  },
  env: {
    FRONTEND_URL: "http://localhost:3000",
  },
} as SubmissionEmailProps;

export default SubmissionEmail;

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "30px",
  fontWeight: "bold",
  textAlign: "center" as const,
  verticalAlign: "middle",
};
