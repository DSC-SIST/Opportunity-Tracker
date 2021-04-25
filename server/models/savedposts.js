import mongoose from "mongoose";
const { Schema } = mongoose;

// database schema
const savedPostSchema = mongoose.Schema({
  userId: String,
  bookmarkedposts: [
    {
      id: String,
      name: String,
      description: String,
      detailsLink: String,
      registrationLink: String,
      category: String,
      createdAt: {
        type: Date,
        default: new Date(),
      }
    }
  ],
});

// converting schema to model
const savedPosts = mongoose.model("savedPosts", savedPostSchema);

//export model so that crud methods can be applied
export default savedPosts;
