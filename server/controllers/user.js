import User from "../models/user.js";
import mongoose from "mongoose";

// return specific user data
export const read = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  try {
    const user = await User.findById(id);
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};


// update user data
export const update = async (req, res) => {
  // get the data 
  const { name:newName, password:newPassword } = req.body;
  const { _id: id } = req.user;

  // check if user exists
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      error: "User not found",
    });
  }
  try {
    // get user from data base
    const user = await User.findById(id);

    //check for necesarry conditions and update the user
    if (!newName) {
      return res.json({ error: "Name is required" });
    } else {
      user.name = newName;
    }
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.json({
          error: "password should be minimum 6 characters long",
        });
      } else {
        user.password = newPassword;
      }
    }
    // save the user
    user.save((err, updateUser) => {
      // handle error in saving user
      if (err) {
        return res.status(400).json({ error: "User update failed" });
      }
     // return updated user
      updateUser.hashed_password = undefined;
      updateUser.salt = undefined;
      res.json(updateUser);
    });
  } catch (error) {
    // handle any other error
    return res.status(404).json({ message: error.message });
  }
};
