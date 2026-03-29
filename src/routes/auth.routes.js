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

module.exports=authRouter;