import React from 'react';
import moment from "moment";
import "./style.css";
const MyPost = ({post})=> {
    return (
<div className="container">
      <div className="post my-3" style={{ backgroundColor: "#e4e4e4" }}>
      <div>
        <h1>{post.name}</h1>
        <p className="text-primary">
          Posted {moment(post.createdAt).fromNow()}
        </p>
        <p className="desc">{post.description}</p>

        <div className="d-flex justify-content-between mt-1  ">


          <div className="d-flex mb-3  ">
            <div className="me-3 mt-2">
              <a
                target="_blank"
                rel="noreferrer"
                className="btn btn-info text-light"
                href={post.detailsLink}
              >
                More details
              </a>
            </div>

            <div className="me-2 mt-2">
              <a
                target="_blank"
                rel="noreferrer"
                className="btn btn-info text-light"
                href={post.registrationLink}
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    );
}

export default MyPost;