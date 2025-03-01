import { SubmissionEmail, VerifyEmail, splitLink } from "@/lib/emails";
import logger from "@/utils/logs";
import { Form, SubmissionSent } from "@formhook/types";
import { Resend } from "resend";

export async function sendEmail(to: string[], subject: string, description: string, email: React.ReactNode, env: Env) {
  const resend = new Resend(env.RESEND_API_KEY);
  const emailAddress = env.RESEND_EMAIL_ADDRESS;

  if (!emailAddress) {
    throw new Error("RESEND_EMAIL_ADDRESS is not set");
  }

  const sentEmail = await resend.emails.send({
    from: `Formscale <${emailAddress}>`,
    to: to.join(","),
    subject,
    text: description,
    react: email,
  });

  return sentEmail.data?.id;
}

export async function sendVerifyEmail(to: string[], otp: string, env: Env) {
  await sendEmail(
    to,
    "Verify your email",
    `Your OTP for Formscale is ${otp}. This code will expire in 15 minutes.`,
    VerifyEmail({ otp, env }),
    env
  );
}

export async function sendSubmissionEmail(to: string[], form: Form, submission: SubmissionSent, env: Env) {
  try {
    let emailId: string | undefined;

    if (!form.development) {
      emailId = await sendEmail(
        to,
        `New submission on ${form.name}`,
        `Submission recieved on ${splitLink(submission.site ?? "")}`,
        SubmissionEmail({ form, submission, env }),
        env
      );
    } else {
      emailId = "Email not sent in development mode";
    }

    await logger({
      env,
      submissionId: submission.id,
      message: `Email sent to ${to.join(", ")}`,
      type: "email",
      data: { formId: form.id, submissionId: submission.id, emailId, recipients: to },
    });
  } catch (error) {
    await logger({
      env,
      submissionId: submission.id,
      message: `Email failed to send to ${to.join(", ")}`,
      type: "email",
      code: 500,
      data: { formId: form.id, submissionId: submission.id, recipients: to, error: error },
    });

    console.error(error);
  }
}
