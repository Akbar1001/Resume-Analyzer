const express=require("express");
const { route } = require("../app");

const authRouter=express.Router();
const authControllers=require("../controllers/auth.controller");

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
 * @route GET /api/auth/logout
 * @description Logout user with tokenblacklisting
 * @access Public
 */
module.exports=authRouter;