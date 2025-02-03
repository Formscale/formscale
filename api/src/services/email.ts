import { Resend } from "resend";
import { SlackConfirmEmail } from "@/lib/emails/default";

export async function sendFormSubmissionEmail(
  data: {
    formName: string;
    submission: any;
    to: string;
  },
  env: Env
) {
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: "forms@yourdomain.com",
    to: data.to,
    subject: `New submission: ${data.formName}`,
    react: SlackConfirmEmail({ validationCode: "DJZ-TLX" }),
  });
}
