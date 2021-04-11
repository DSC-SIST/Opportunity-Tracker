import User from "../models/user.js";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import dotenv from "dotenv";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const expressJwt = require('express-jwt')

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// handle signup
export const signup = (req, res) => {
  // get new user data
  const { name, email, password } = req.body;
  
  // check if user already exist
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    
    // if new user generate a token
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    //verification email template
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
            <h1>Please use the below link to activate your account</h1>
            <p>${process.env.CLIENT_URL}/account-activation/${token}</p>
            <hr/>
            <p>This email may contain sensituve information</p>
            <p>${process.env.CLIENT_URL}</p>
        `,
    };
    // sending email with token
    sgMail
      .send(emailData)
      .then((sent) => {
        // console.log("signup email sent")
        return res.json({
          message: `Email has been sent to ${email}. follow the instruction to activate your account`,
        });
      })
      .catch((err) => {
        console.log("email not sent");
        return res.status(401).json({
          message: err.message,
        });
      });
  });
};

// handle account activation
export const accountActivation = (req, res) => {
  // get signup token
  const { token } = req.body;
 
  // verify token
   if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        // handle error during verification
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Expired link. Signup again",
          });
        }
        
        // if right user ..crete a new user
        const { name, email, password } = jwt.decode(token);

        const user = new User({ name, email, password });
        
        // saving the user
        user.save((err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return res.status(401).json({
              error: "Error saving user in database. Try signup again",
            });
          }
          return res.json({
            message: "Signup success. Please signin.",
          });
        });
      }
    );
  } else {
    // handle error during creating the user
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
};

// handle signin
export const signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // authentication of user
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }

    // generate a toke and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECERT, {expiresIn: "7d"});
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};


//middleware
// check if user is signed in
export const requireSignin = expressJwt({
  secret: process.env.JWT_SECERT, algorithms: ['HS256'] 
})


// chech=k if signin user is a admin
export const adminMiddleware = (req,res,next) => {
  User.findById({_id: req.user._id}).exec((err,user)=>{
    if (err || !user){
      return res.status(400).json({
        error: 'User not found'
      });
    }

    if(user.role !== 'admin'){
      return res.status(400).json({
        error: 'Admin resource. Access denied'
      });
    }
    
    req.profil = user;
    next();

  })
}