import React, { useState } from "react";
import moment from "moment";
import "./style.css";
import dotenv from "dotenv";

dotenv.config()

const Post = ({ post }) => {

  const handleBookmark = (event) => {
    const isBookmarked = (event.target.className ===  "bi bi-bookmark mx-2") ? 'bi bi-bookmark-fill mx-2' :'bi bi-bookmark mx-2';
    event.target.className = isBookmarked;    
  };
  

  return (
    <div className="post my-3" style={{backgroundColor:"#e4e4e4"}}>
      <div>
        <h1>{post.name}</h1>
        <p className="text-primary">
          Posted {moment(post.createdAt).fromNow()}
        </p>
        <p className="desc">{post.description}</p>

        <div className="d-flex justify-content-between mt-1  ">
          <div className="mt-2">
            <i
              className="bi bi-bookmark mx-2"
              style={{ fontSize: "1.5rem" }}
              onClick={handleBookmark}
            ></i>
          </div>

          <div className="d-flex mb-3  ">
            <div className="me-3 mt-2">
              <a target="_blank"  className="btn btn-info text-light" href={post.detailsLink} >
 
                  More details

              </a>
            </div>

            <div className="me-2 mt-2">
              <a target="_blank" className="btn btn-info text-light" href={post.registrationLink}>

                  Register Now
 
              </a>
            </div>
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
