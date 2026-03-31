const express=require("express");
const { route } = require("../app");

const authRouter=express.Router();
const authControllers=require("../controllers/auth.controller");
const authmiddleware=require("../middleware/auth.middleware");

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register",authControllers.registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login an existing user
 * @access Public
 */
authRouter.post("/login",authControllers.LoginController);

/**
 * @route GET /api/auth/logout
 * @description Logout user with tokenblacklisting
 * @access Public
 */
authRouter.get("/logout",authControllers.LogoutController);

/**
 * @route GET /api/auth/get-me
 * @description Gives the details of current logged in user
 * @access Private
 */
authRouter.get("/get-me",authmiddleware.authUser,authControllers.getMeController);


module.exports=authRouter;