import { Spinner } from "react-bootstrap";
import { Container } from "./Container";

export function LoadingPage() {
  return (
    <Container>
      <div className="d-flex justify-content-center align-items-baseline gap-2">
        <Spinner />
        <h1>로딩 중</h1>
      </div>
    </Container>
  );
}

export default LoadingPage;
