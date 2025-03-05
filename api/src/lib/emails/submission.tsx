/** @jsxImportSource react */

import { Form, SubmissionSent } from "@formscale/types";
import { contentFormatter, FormatCell, uppercase } from "@formscale/utils";
import { Button, Section, Text } from "@react-email/components";
import { format } from "date-fns";
import { Fragment } from "react/jsx-runtime";
import { BaseEmail } from "./base";

interface SubmissionEmailProps {
  form: Form;
  submission: SubmissionSent;
  env: Env;
}

export const splitLink = (link: string) => {
  return link.split("/").slice(0, 3).join("/");
};

export const EmailButton = ({ link, text }: { link: string; text: string }) => {
  return (
    <Button style={button} href={link} target="_blank">
      {text}
    </Button>
  );
};

export const Item = ({ label, value }: { label: string; value: string }) => {
  return (
    <Fragment>
      <Text style={submissionLabel}>{label}</Text>
      <Text style={submissionText}>{value}</Text>
    </Fragment>
  );
};

export const SubmissionEmail = ({ form, submission, env }: SubmissionEmailProps) => {
  const development = form.development ? " (Development)" : "";
  const frontendUrl = env.FRONTEND_URL;

  return (
    <BaseEmail
      title={`New submission on ${form.name}${development}`}
      description={`Submission recieved on`}
      link={`${splitLink(submission.site ?? "")}.`}
      footer={
        "You're receiving this because you've confirmed your email on Formscale and email notifications are enabled."
      }
      env={env}
    >
      <Section style={section}>
        {Object.keys(submission.data).map((key) => {
          const formattedValue = FormatCell(submission.data[key], contentFormatter, env.BUCKET_URL);
          return (
            // <Fragment key={key}>
            //   <Text style={submissionLabel}>{uppercase(key)}</Text>
            //   <Text style={submissionText}>
            //     {typeof formattedValue === "string" ? formattedValue : formattedValue.content}
            //   </Text>
            // </Fragment>
            <Item
              key={key}
              label={uppercase(key)}
              value={typeof formattedValue === "string" ? formattedValue : formattedValue.content}
            />
          );
        })}
      </Section>
      <EmailButton link={`${frontendUrl}/forms/${form.id}/submissions/${submission.id}`} text="View Submission" />
      <Text style={descriptionText}>
        Submitted at {format(new Date(submission.createdAt), "h:mm a 'on' MMMM do, yyyy")} from{" "}
        {submission.location.split(" (")[0]}.
      </Text>
    </BaseEmail>
  );
};

SubmissionEmail.PreviewProps = {
  form: {
    id: "123",
    name: "Test Form",
    development: true,
  },
  submission: {
    id: "123",
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      message: "This is a test message",
      checkbox: ["Option 1", "Option 2"],
      file: "https://example.com/test.pdf",
    },
    location: "New York, NY, US (America/New York)",
    site: "https://example.com/test?stuff=123",
    createdAt: new Date(),
  },
  env: {
    FRONTEND_URL: "http://localhost:3000",
  },
} as SubmissionEmailProps;

export default SubmissionEmail;

const section = {
  marginTop: "-8px",
};

const submissionLabel = {
  color: "#b7b7b7",
  lineHeight: "4px",
  fontSize: "16px",
};

const submissionText = {
  fontSize: "20px",
  lineHeight: "20px",
  paddingBottom: "16px",
};

const descriptionText = {
  color: "#b7b7b7",
};

const button = {
  backgroundColor: "#ffce00",
  color: "#000",
  padding: "10px 20px",
  fontWeight: "bold",
  borderRadius: "6px",
  marginTop: "12px",
  marginBottom: "24px",
  fontSize: "16px",
};
