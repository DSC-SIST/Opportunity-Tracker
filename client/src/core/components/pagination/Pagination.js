import React, {useState,useEffect} from 'react';
import Post from '../Post/Post';
import './style.css'

const Pagination = ({ data, pageLimit, dataLimit })=> {
    const [pages] = useState(Math.round(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);
  
    function goToNextPage() {
        setCurrentPage((page) => page + 1);
      }
  
      function goToPreviousPage() {
        setCurrentPage((page) => page - 1);
      }
  
      function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
      }
  
      const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
      };
      const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
      };

      useEffect(() => {
        window.scrollTo({ behavior: 'smooth', top: '0px' });
      }, [currentPage]);

     return (
        <div>

      
          {/* show the posts, 10 posts at a time */}
          <div className="dataContainer">
            {getPaginatedData().map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
      
          {/* show the pagiantion
              it consists of next and previous buttons
              along with page numbers, in our case, 5 page
              numbers at a time
          */}
          <div className="pagination">
            {/* previous button */}
            <h5
              onClick={goToPreviousPage}
              className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
            >
              PREV
            </h5>
      
            {/* show page numbers */}
            {getPaginationGroup().map((item, index) => (
              <button
                key={index}
                onClick={changePage}
                className={`paginationItem ${currentPage === item ? 'active' : null}`}
              >
                <span>{item}</span>
              </button>
            ))}
      
            {/* next button */}
            
            <h5
              onClick={goToNextPage}
              className={`next ${currentPage === pages ? 'disabled' : ''}`}
            >
              NEXT
            </h5>
          </div>
        </div>
      );
}

export default Pagination;