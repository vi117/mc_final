import Pagination from "react-bootstrap/Pagination";
import "./pagination.css";

const Page = ({
  activePage,
  range = 5,
  endPage,
  handlePageChange,
}) => {
  const start = Math.max(activePage - Math.floor(range / 2), 1);
  const last = Math.min(start + range, endPage);
  const pageItems = [];

  for (let pageNumber = start; pageNumber <= last; pageNumber++) {
    pageItems.push(
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === activePage}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>,
    );
  }

  return <Pagination className={"co-page_s4m49_1"}>{pageItems}</Pagination>;
};

export default Page;
