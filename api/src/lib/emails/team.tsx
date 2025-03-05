/** @jsxImportSource react */

import { Form } from "@formscale/types";
import { Section } from "@react-email/components";
import { BaseEmail } from "./base";
import { EmailButton, Item } from "./submission";

interface TeamInviteEmailProps {
  code: string;
  form: Form;
  invitee: string;
  email: string;
  env: Env;
}

export const TeamInviteEmail = ({ code, form, email, invitee, env }: TeamInviteEmailProps) => {
  const frontendUrl = env.FRONTEND_URL;
  return (
    <BaseEmail
      title={"Accept form invitation"}
      description={`You've been invited to join the form "${form.name}". Click the button below to accept the invitation.`}
      footer={
        "This link expires in 24 hours. By accepting this invitation, submissions will be forwarded to your email."
      }
      env={env}
    >
      <Section>
        <Item label="Invited by" value={invitee} />
        <Item label="Your email" value={email} />
        <EmailButton link={`${frontendUrl}/verify/team/${form.id}/${code}`} text="Accept Invitation" />
      </Section>
    </BaseEmail>
  );
};

TeamInviteEmail.PreviewProps = {
  code: "123456",
  form: {
    id: "123456",
    name: "Contact Form",
  },
  invitee: "John Doe",
  email: "jane.doe@example.com",
  env: {
    FRONTEND_URL: "http://localhost:3000",
  },
} as TeamInviteEmailProps;

export default TeamInviteEmail;
