import express from "express";
import {signup, accountActivation,signin} from '../controllers/auth.js';
import {read} from '../controllers/user.js';

//import validators
import {userSignupValidator,userSigninValidator} from '../validators/auth.js'
import {runValidation} from '../validators/index.js'

const authRoutes = express.Router();

authRoutes.post('/signup',userSignupValidator,runValidation, signup)

authRoutes.post('/account-activation', accountActivation)

authRoutes.post('/signin',userSigninValidator,runValidation,signin)



export default authRoutes;