import React from "react";
import moment from "moment";
import "./style.css";

const Post = ({ post }) => {

  const handleLike = (event) => {
    const isLiked = (event.target.className ===  "bi bi-hand-thumbs-up mx-2") ? 'bi bi-hand-thumbs-up-fill mx-2' :'bi bi-hand-thumbs-up mx-2';
    event.target.className = isLiked ;
  }

  const handleBookmark = (event) => {
    const isBookmarked = (event.target.className ===  "bi bi-bookmark mx-2") ? 'bi bi-bookmark-fill mx-2' :'bi bi-bookmark mx-2';
    event.target.className = isBookmarked;
    console.log(post)
  };

  return (
    <div className="post my-3">
      <div>
        <h1>{post.name}</h1>
        <p className="text-primary">
          Posted {moment(post.createdAt).fromNow()}
        </p>
        <p className="desc">{post.description}</p>

        <div className="d-flex justify-content-between mt-1  ">
          <div className="mt-2">
            <i
              className="bi bi-hand-thumbs-up mx-2 "
              style={{ fontSize: "1.5rem" }}
              onClick={handleLike}
            ></i>
            <i className="bi bi-share mx-2 " style={{ fontSize: "1.5rem" }}></i>
            <i
              className="bi bi-bookmark mx-2"
              style={{ fontSize: "1.5rem" }}
              onClick={handleBookmark}
            ></i>
          </div>

          <div className="d-flex mb-3  ">
            <div className="me-3 mt-2">
              <a href={post.detailsLink}>
                <button type="button" class="btn btn-info text-light">
                  More details
                </button>
              </a>
            </div>

            <div className="me-2 mt-2">
              <a href={post.registrationLink}>
                <button type="button" class="btn btn-info text-light">
                  Register Now
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
