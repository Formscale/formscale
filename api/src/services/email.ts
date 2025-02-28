import { SubmissionEmail, VerifyEmail, splitLink } from "@/lib/emails";
import { Form, SubmissionSent } from "@formhook/types";
import { Resend } from "resend";
import db from "../db";
import { create } from "../db/crud";

export async function sendEmail(to: string[], subject: string, description: string, email: React.ReactNode, env: Env) {
  const resend = new Resend(env.RESEND_API_KEY);
  const emailAddress = env.RESEND_EMAIL_ADDRESS;

  if (!emailAddress) {
    throw new Error("RESEND_EMAIL_ADDRESS is not set");
  }

  await resend.emails.send({
    from: `Formscale <${emailAddress}>`,
    to: to.join(","),
    subject,
    react: email,
  });
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
    const emailId = await sendEmail(
      to,
      `New submission on ${form.name}`,
      `Submission recieved on ${splitLink(submission.site ?? "")}`,
      SubmissionEmail({ form, submission, env }),
      env
    );

    await create(db(env), "log", {
      submissionId: submission.id,
      type: "email",
      message: `Email sent to ${to.join(", ")}`,
      code: 200,
      data: JSON.stringify({ formId: form.id, submissionId: submission.id, emailId, recipients: to }),
    });
  } catch (error) {
    await create(db(env), "log", {
      submissionId: submission.id,
      type: "email",
      message: `Email failed to send to ${to.join(", ")}`,
      code: 500,
      data: JSON.stringify({ formId: form.id, submissionId: submission.id, recipients: to, error: error }),
    });

    console.error(error);
  }
}
