import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post/Post";
import { CircularProgress } from "@material-ui/core";
import Pagination from "./pagination/Pagination";

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const getPosts = async () => {
    try {
      const userPosts = await axios.get("http://localhost:8000/api/post/");
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
    pageLimit={Math.ceil(posts.length/3)}
    dataLimit={3}
  />
  )
};

export default Posts;
