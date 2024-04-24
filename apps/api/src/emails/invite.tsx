import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Text
} from "@react-email/components";

interface InviteEmailProps {
    token: string;
    tag: string;
}

const baseUrl = "https://bytepad.pro";

export const InviteEmail = ({
    token, tag
}: InviteEmailProps) => (
    <Html lang="en">
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <title>Bytepad</title>
        </Head>
        <Body>
            <Container style={main}>
                <Container style={container}>
                    <Heading style={h1}>You have been invited to Bytepad</Heading>
                    <Text style={text}>
                        You have been invited to join a Bytepad project. Click the link below to get started.
                    </Text>
                    <Link href={`${baseUrl}/auth/invite/${token}`} style={link}>
                        Join Project
                    </Link>
                    <Text style={text}>
                        If you have any trouble with the button above, you can also copy and paste the link below into your browser.
                    </Text>
                    <Text style={code}>
                        {`${baseUrl}/auth/invite/${token}`}
                    </Text>
                    <Text style={footer}>
                        Bytepad is an online coding playground platform.
                    </Text>
                </Container>
            </Container>
        </Body>
    </Html>
);

InviteEmail.PreviewProps = {
    token: "123456",
    tag: "my-project",
} as InviteEmailProps;

export default InviteEmail;

const main = {
    backgroundColor: "#ffffff",
};

const container = {
    paddingLeft: "12px",
    paddingRight: "12px",
    margin: "0 auto",
};

const h1 = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "40px 0",
    padding: "0",
};

const link = {
    color: "#2754C5",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    textDecoration: "underline",
};

const text = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    margin: "24px 0",
};

const footer = {
    color: "#898989",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "12px",
    lineHeight: "22px",
    marginTop: "12px",
    marginBottom: "24px",
};

const code = {
    display: "inline-block",
    padding: "16px 4.5%",
    width: "90.5%",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
    border: "1px solid #eee",
    color: "#333",
};
