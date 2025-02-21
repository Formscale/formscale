/** @jsxImportSource react */

import { Section, Text } from "@react-email/components";
import { BaseEmail } from "./base";

interface VerifyEmailProps {
  otp: string;
  env: Env;
}

export const VerifyEmail = ({ otp, env }: VerifyEmailProps) => {
  console.log("otp", otp);

  return (
    <BaseEmail
      title={"Verify your email"}
      description={"Your OTP expires in 15 minutes - enter it in your open browser and we'll sign you in."}
      footer={"If you didn't request this email, you can safely ignore it."}
      env={env}
    >
      <Section style={codeBox}>
        <Text style={confirmationCodeText}>{otp}</Text>
      </Section>
    </BaseEmail>
  );
};

VerifyEmail.PreviewProps = {
  otp: "123456",
  env: {
    FRONTEND_URL: "http://localhost:3000",
  },
} as VerifyEmailProps;

export default VerifyEmail;

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
