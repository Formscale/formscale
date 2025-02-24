/** @jsxImportSource react */

import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

interface BaseEmailProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: string;
  env: Env;
}

export const BaseEmail = ({ title, description, children, footer, env }: BaseEmailProps) => {
  const frontendUrl = env.FRONTEND_URL;
  // const bucketUrl = env.BUCKET_URL;

  // const logoUrl = bucketUrl
  //   ? `${bucketUrl}/assets/formscale-logo.png`
  //   : `${frontendUrl}/assets/logos/formscale-logo.png`;

  const logoUrl = `${frontendUrl}/assets/logos/formscale-logo.png`;

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Link href={frontendUrl}>
              <Img src={logoUrl} width="223" height="64" alt="Formscale logo" />
            </Link>
          </Section>
          <Heading style={h1}>{title}</Heading>
          <Text style={heroText}>{description}</Text>

          {/* <Section style={codeBox}>
          <Text style={confirmationCodeText}>{validationCode}</Text>
        </Section> */}

          {children}

          <Text style={text}>{footer}</Text>

          {/* <Section>
            <Row style={footerLogos}>
              <Column style={{ width: "66%" }}>
                <Img src={`${baseUrl}/static/slack-logo.png`} width="120" height="36" alt="Slack" />
              </Column>
              <Column>
                <Section>
                  <Row>
                    <Column>
                      <Link href="/">
                        <Img
                          src={`${baseUrl}/static/slack-twitter.png`}
                          width="32"
                          height="32"
                          alt="Slack"
                          style={socialMediaIcon}
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="/">
                        <Img
                          src={`${baseUrl}/static/slack-facebook.png`}
                          width="32"
                          height="32"
                          alt="Slack"
                          style={socialMediaIcon}
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="/">
                        <Img
                          src={`${baseUrl}/static/slack-linkedin.png`}
                          width="32"
                          height="32"
                          alt="Slack"
                          style={socialMediaIcon}
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section> */}

          <Section>
            {/* <Link style={footerLink} href="https://slackhq.com" target="_blank" rel="noopener noreferrer">
            Our blog
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link style={footerLink} href="https://slack.com/legal" target="_blank" rel="noopener noreferrer">
            Policies
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link style={footerLink} href="https://slack.com/help" target="_blank" rel="noopener noreferrer">
            Help center
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://slack.com/community"
            target="_blank"
            rel="noopener noreferrer"
            data-auth="NotApplicable"
            data-linkindex="6"
          >
            Slack Community
          </Link> */}
            <Text style={footerText}>
              {new Date().getFullYear()} Formscale / DRIS LLC. <br />
              11500 Wayzata Blvd #1222, Minnetonka, MN, 55305, USA <br />
              <br />
              All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

BaseEmail.PreviewProps = {
  title: "Welcome to Formscale!",
  description: "We're excited to have you on board.",
  footer: "You are receiving this because you confirmed this email address on Formscale.",
  env: {
    FRONTEND_URL: "http://localhost:3000",
  },
} as BaseEmailProps;

export default BaseEmail;

const footerText = {
  fontSize: "12px",
  color: "#b7b7b7",
  lineHeight: "15px",
  textAlign: "left" as const,
  marginBottom: "50px",
};

const footerLink = {
  color: "#b7b7b7",
  textDecoration: "underline",
};

const footerLogos = {
  marginBottom: "32px",
  paddingLeft: "8px",
  paddingRight: "8px",
  width: "100%",
};

const socialMediaIcon = {
  display: "inline",
  marginLeft: "32px",
};

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 12px",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
