import mongoose from "mongoose";
import Posts from "../models/posts.js";
import savedPosts from "../models/savedposts.js";

// fetch all posts from post database
export const getPosts = async (req, res) => {
  try {
    const posts = await Posts.find();

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// create a new post in post database
export const createPost = async (req, res) => {
  const post = req.body;

  const newOpportunity = new Posts(post);

  try {
    await newOpportunity.save();

    res.status(201).json(newOpportunity);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// update a specific post in post database
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;

  const post = req.body;

  //checking if the id is a valid moongoose id
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json("No post with that id");
  }

  const updatedPost = await Posts.findByIdAndUpdate(_id, post, { new: true });

  res.json(updatedPost);
};

// delete a specific post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Posts.findByIdAndRemove(id);

  res.json({ message: "Post Deleted Successfully" });
};

// bookmark post
export const bookmarkPost = async (req, res) => {
  const { userId, post } = req.body;

  await savedPosts.findOne({ userId: userId }, (err, data) => {
    if (data === null) {
      const userData = {
        userId: `${userId}`,
        bookmarkedposts: [post],
      };
      savedPosts.collection
        .insertOne(userData)
        .then(() => {
          res.json({
            message: "post bookmarked",
          });
        })
        .catch((error) => {
          res.status(401).json({
            error: "this post cannot be bookmarked now",
          });
        });
    } else {
      savedPosts.find(
        { userId: userId, bookmarkedposts: { $elemMatch: { id: post.id } } },
        (err, data) => {
          console.log({ err, data });
          if (data.length === 0) {
            savedPosts
              .updateOne(
                { userId: `${userId}` },
                { $push: { bookmarkedposts: post } }
              )
              .then(() => {
                res.json({
                  message: "post bookmarked",
                });
              })
              .catch((error) => {
                res.status(401).json({
                  error: "this post cannot be bookmarked now",
                });
              });
          } else {
            res.json({ message: "post is alerady saved" });
          }
        }
      );
    }
  });
};

// delete bookmark
export const deleteBookmark = async (req, res) => {
  const { userId,postId } = req.body;

  await savedPosts.findOneAndUpdate(
    {"userId":userId},
    {$pull:{"bookmarkedposts":{"id":postId}}}, (err,data)=>{
      if(data){
        res.status(200).send(data)
      }else {
        res.status(401).json({error: err.message})
      }
    })

    
};

// get bookmarks
export const getBookmarks = async (req, res) => {
  const { id: userId } = req.params;
  try {
    await savedPosts.findOne({ userId: userId }, (err, data) => {
      if (data) {
        res.status(200).json(data.bookmarkedposts);
      } else {
        res.status(401).json({ error: "No bookmarks" });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// get user posts

export const getUserPosts = async (req,res)=> {

  const {userID} = req.params;

  await Posts.find({"userId":userID}, (err,data)=> {
    if(data){
      res.status(200).json(data)
    }else {
      res.status(401).json({error:err.message})
    }
  })
}
