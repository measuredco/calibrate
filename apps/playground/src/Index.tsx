import {
  Box,
  Container,
  Heading,
  Link,
  Root,
  Stack,
  Text,
} from "@measured/calibrate-react";

export function Index() {
  return (
    <Root appRoot>
      <Container gutter="narrow">
        <Box paddingBlock="2xl" paddingInline="none">
          <Stack gap="lg">
            <Heading level={1} size="2xl" text="Calibrate playground" />
            <Text as="p">
              In-browser harness for the React adapter. Open one of the demos:
            </Text>
            <Stack as="ul" gap="sm">
              <li>
                <Link
                  href="#app"
                  label="Kitchen sink — form controls, alerts, sidebar, menu"
                />
              </li>
              <li>
                <Link
                  href="#example"
                  label="Full page — compose-first composition (skill example)"
                />
              </li>
              <li>
                <Link
                  href="#stepper"
                  label="Stepper — custom-with-tokens example"
                />
              </li>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Root>
  );
}
