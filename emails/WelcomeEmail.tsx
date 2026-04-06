import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export function WelcomeEmail({ name }: { name?: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Quantum</Preview>
      <Body style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
        <Container style={{ padding: "24px" }}>
          <Heading>Welcome{name ? `, ${name}` : ""}</Heading>
          <Text>Thanks for joining. Explore new drops and member benefits.</Text>
        </Container>
      </Body>
    </Html>
  );
}
