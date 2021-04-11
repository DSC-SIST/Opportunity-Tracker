import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Sidebar(props) {
  return (
    <div className="side-bar">
      <div className="d-flex justify-content-center">
        {/* <button type="button" class="btn btn-primary mt-3 new-post">
          
        </button> */}
        <Link to="/newpost" className="btn btn-primary mt-3 new-post">
          Create New Post
        </Link>
      </div>
      <div className="p-3">
        <div>
          <h5 className="ps-1"> Posts</h5>
          <ul>
          <li>My Posts</li>
            <li >
              <Link to="/bookmarks" style={{color: "#000", textDecoration: "none"}}>Bookmarked Posts</Link>
            </li>

          </ul>
        </div>
        <div>
          <h5 className="ps-1 ">Category</h5>
          <ul>
            <li>Open-Source</li>
            <li>Interships</li>
            <li>Scholarships</li>
            <li>Student Programs</li>

            <li>Coding Competitons</li>
            <li>Others categories</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
