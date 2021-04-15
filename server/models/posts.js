import mongoose from "mongoose";

// database schema
const postSchema = mongoose.Schema({
  name: String,
  description: String,
  detailsLink: String,
  registrationLink: String,
  category: String,
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// converting schema to model
const Posts = mongoose.model("Posts", postSchema);

//export model so that crud methods can be applied
export default Posts;
