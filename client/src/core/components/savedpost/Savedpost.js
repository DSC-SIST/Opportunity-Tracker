import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../pagination/Pagination";

import dotenv from "dotenv";
import { getCookie, isAuth } from "../../../auth/Helpers";
import Layout from "../../Layout";
import BookmarkedPost from "./BookmarkedPost";
import Sidebar from "../sidebar/Sidebar";
import "./style.css";
dotenv.config();

const Savedpost = (props) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const id = isAuth()._id;
  const getPosts = async () => {
    try {
      const bookmarkedPosts = await axios.get(
        `${process.env.REACT_APP_DEPLOYED_API}/post/bookmarks/${id}`,
        {
          headers: { Authorization: `Bearer ${getCookie("token")}` }
        }
      );

      setSavedPosts(bookmarkedPosts.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const informParent = (data) => {
    setSavedPosts(data)
  }

  return !savedPosts.length ? (
    <Layout>
      <div className="container  ">
        <div className="row">
          <div className="col-3">
            <Sidebar />
          </div>

          <div className="col-6">
          <h1>No bookmarks available</h1>
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <Layout>
      <div className="container  ">
        <div className="row">
          <div className="col-3">
            <Sidebar />
          </div>

          <div className="col-6">
            <Pagination
              data={savedPosts}
              pageLimit={Math.ceil(savedPosts.length / 3)}
              dataLimit={3}
              Component={BookmarkedPost}
              informParent={informParent}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Savedpost;
