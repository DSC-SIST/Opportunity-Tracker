import express from "express";
import { adminMiddleware, requireSignin } from "../controllers/auth.js";
import {read,update} from '../controllers/user.js';


const userRoutes = express.Router();
// users relate routes
userRoutes.get('/user/:id',requireSignin,read);
userRoutes.put('/user/update/',requireSignin,update);
userRoutes.put('/admin/update/',requireSignin,adminMiddleware,update);

export default userRoutes;
