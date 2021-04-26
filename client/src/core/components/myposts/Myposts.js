import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../pagination/Pagination";

import dotenv from "dotenv";
import { getCookie, isAuth } from "../../../auth/Helpers";
import Layout from "../../Layout";

import Sidebar from "../sidebar/Sidebar";
import MyPost from "./MyPost";
import "./style.css";
dotenv.config();

const Myposts = (props) => {
  const [myPosts, setMyPosts] = useState([]);

  const userId = isAuth()._id;
  const getPosts = async () => {
    try {
      const posts = await axios.get(
        `${process.env.REACT_APP_DEPLOYED_API}/post/myposts/${userId}`,
        {
          headers: { Authorization: `Bearer ${getCookie("token")}` }
        }
      );

     setMyPosts(posts.data.reverse())
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);



  return !myPosts.length ? (
    <Layout>
      <div className="container  ">
        <div className="row">
          <div className="col-3">
            <Sidebar />
          </div>

          <div className="col-6">
            <h1>You have created no posts</h1>
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
              data={myPosts}
              pageLimit={Math.ceil(myPosts.length / 3)}
              dataLimit={3}
              Component={MyPost}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Myposts;
