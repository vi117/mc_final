import { lazy, Suspense } from "react";

const LazyEditor = lazy(() => import("./Editor.tsx"));

function Editor({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    // TODO(vi117): 예쁜 로딩
    <Suspense fallback={<div>loading...</div>}>
      <LazyEditor onChange={onChange} value={value} />
    </Suspense>
  );
}

export default Editor;
