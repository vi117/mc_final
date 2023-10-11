import React from "react";

export default function Page(props: {
  activePage: number;
  range?: number;
  endPage: number;
  handlePageChange: (page: number) => void;
}): React.ReactNode;
