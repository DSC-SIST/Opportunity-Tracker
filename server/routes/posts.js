import express from 'express';
import {getPosts,createPost,updatePost,deletePost,bookmarkPost,deleteBookmark,getBookmarks,getUserPosts} from '../controllers/posts.js';
import {  requireSignin } from "../controllers/auth.js";
const postRoutes = express.Router();


postRoutes.get('/post/',getPosts);
postRoutes.post('/post/',createPost);
postRoutes.patch('/post/:id',requireSignin,updatePost);
postRoutes.delete('/post/:id',requireSignin,deletePost);
postRoutes.get('/post/bookmarks/:id',requireSignin,getBookmarks)
postRoutes.post('/post/bookmark',bookmarkPost);
postRoutes.post('/post/bookmarks/delete',requireSignin,deleteBookmark);
postRoutes.get('/post/myposts/:userId',requireSignin,getUserPosts)


export default postRoutes;