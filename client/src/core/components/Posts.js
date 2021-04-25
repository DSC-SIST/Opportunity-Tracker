import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import Pagination from "./pagination/Pagination";

import dotenv from "dotenv";
import Post from "./Post/Post";
dotenv.config();

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const getPosts = async () => {
    try {
      const userPosts = await axios.get(
        `${process.env.REACT_APP_DEPLOYED_API}/post`
      );
      setPosts(userPosts.data.reverse()); // set State
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  return !posts.length ? (
    <CircularProgress />
  ) : (
    <Pagination
      data={posts}
      pageLimit={Math.ceil(posts.length / 3)}
      dataLimit={3}
      Component = {Post} 
    />
  );
};

export default Posts;
