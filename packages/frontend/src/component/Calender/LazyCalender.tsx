import { lazy, Suspense } from "react";

const LazyCanlender = lazy(() => import("./Calender"));

function Calender(props: {
  startDate: Date;
  endDate: Date;
  onChange: (date: {
    startDate: Date;
    endDate: Date;
  }) => void;
}) {
  return (
    // TODO(vi117): 예쁜 로딩
    <Suspense fallback={<div>loading...</div>}>
      <LazyCanlender
        {...props}
      />
    </Suspense>
  );
}

export default Calender;
