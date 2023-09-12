import Pagination from "react-bootstrap/Pagination";
import "./commu.css";

const Page = ({ totalItems, itemsPerPage, activePage, handlePageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageItems = [];
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    pageItems.push(
      <Pagination.Item
        itemClass="page-item"
        key={pageNumber}
        active={pageNumber === activePage}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>,
    );
  }

  return <Pagination className="px-4">{pageItems}</Pagination>;
};

export default Page;
