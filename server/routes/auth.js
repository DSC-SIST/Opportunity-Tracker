import express from "express";
import {signup, accountActivation,signin,forgotPassword,resetPassword, googleLogin} from '../controllers/auth.js';

//import validators
import {userSignupValidator,userSigninValidator, forgotPasswordValidator, resetPasswordValidator} from '../validators/auth.js'
import {runValidation} from '../validators/index.js'

const authRoutes = express.Router();

authRoutes.post('/signup',userSignupValidator,runValidation, signup)

authRoutes.post('/account-activation', accountActivation)

authRoutes.post('/signin',userSigninValidator,runValidation,signin)


// forgot and reset password routes
authRoutes.put('/forgot-password',forgotPasswordValidator, runValidation, forgotPassword)

authRoutes.put('/reset-password',resetPasswordValidator, runValidation, resetPassword)

// google auth
authRoutes.post('/google-login',googleLogin)


export default authRoutes;