import { Container } from "./Container";

export function ErrorPage({
  error,
}: {
  error: {
    message: string;
  };
}) {
  return (
    <Container>
      <h1>Error!</h1>
      <p>{error.message}</p>
    </Container>
  );
}

export default ErrorPage;
