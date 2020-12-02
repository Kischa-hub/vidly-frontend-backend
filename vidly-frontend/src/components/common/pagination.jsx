import React from "react";
import _lodash from "lodash";
//import PropTypes from "prop-types";
const Pagination = (props) => {
  //Objeckt distractring
  const { itemCount, pageSize, currentPage, onPageChanged } = props;
  //console.log("currentPage", currentPage);
  const pagesCount = Math.ceil(itemCount / pageSize);
  // console.log("pagesCount", pagesCount);
  if (pagesCount === 1) return null;
  const pages = _lodash.range(1, pagesCount + 1);

  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => (
          <li
            className={page === currentPage ? "page-item active" : "page-item"}
            key={page}
          >
            <button
              className="page-link"
              onClick={() => onPageChanged(page)}
              style={{ cursor: "pointer" }}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Pagination.propTypes = {
  //   itemCount: PropTypes.number.isRequired,
  //   pageSize: PropTypes.number.isRequired,
  //   currentPage: PropTypes.number.isRequired,
  //   onPageChanged: PropTypes.func.isRequired,
  // };
};

export default Pagination;
