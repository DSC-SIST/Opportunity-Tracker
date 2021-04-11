import { check } from "express-validator";

export const userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is Required"),

  check("email").isEmail().withMessage("Must be a valid email address"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const userSigninValidator = [

  check("email").isEmail().withMessage("Must be a valid email address"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];