import User from "../models/user.js";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import _ from "lodash";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const expressJwt = require("express-jwt");

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
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
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
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

// chech=k if signin user is a admin
export const adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profil = user;
    next();
  });
};

export const forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }

    // if user email preesent in db
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    //verification email template
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset Link`,
      html: `
                <h1>Please use the below link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr/>
                <p>This email may contain sensituve information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };

    // update the user data with password reset link so that future reset password token can be verified
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Database connection error on user password forgot request",
        });
      } else {
        // sending email with token after updating the password reset link with token
        sgMail
          .send(emailData)
          .then((sent) => {
            // console.log("signup email sent")
            return res.json({
              message: `Email has been sent to ${email}. follow the instruction to reset your passowrd`,
            });
          })
          .catch((err) => {
            return res.status(401).json({
              message: err.message,
            });
          });
      }
    });
  });
};

export const resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: "Database connection error on user password forgot request",
          });
        }
      }
    );

    User.findOne({ resetPasswordLink }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "Something went wrong.Try later",
        });
      }

      const updatedFields = {
        password: newPassword,
        resetPasswordLink: "",
      };

      // megring user with updated fields
      user = _.extend(user, updatedFields);
      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: "Error resetting user password",
          });
        }

        res.json({
          message: "Password Updated! Log in with the new password",
        });
      });
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = (req, res) => {
  const { idToken } = req.body;


  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            console.log({ _id, email, name, role })
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            
            const password = email + process.env.JWT_SECRET;
            
            user = new User({ name, email, password });
            console.log(user)
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `Account Details`,
                html: `   <h2>Email: ${email}</h2>
                          <h2>Password: ${password}</h2>
                          <h1>Please use the below link to reset your password</h1>
                          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                          <hr/>
                          <p>This email may contain sensituve information</p>
                          <p>${process.env.CLIENT_URL}</p>
                      `,
              };
              sgMail
              .send(emailData)
              .then((sent) => {
                // console.log("signup email sent")
                return res.json({
                  token,
                  user: { _id, email, name, role },
                  message: `Account Details sent to ${email}`,
                });
              })
              .catch((err) => {
                return res.status(401).json({
                  message: "signup error",
                });
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};
