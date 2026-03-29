const userModel=require("../models/user.model");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");


/**
 * @name registerUserController
 * @description Register a new user, expects username, email, password in the request
 * @access Public
 */
 async function registerUserController(req,res) {
    
    const {username,email,password}=req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username , email and password"
        })
    }

    const isUserAlreadyexists=userModel.findOne({
        $or:[{username},{email}]    // check on the username OR email
    })

    if(isUserAlreadyexists){
        return res.status(400).json({
            message:"User with the same username or email already exists"
        })
    }

    const hash= await bcrypt.hash(password,10);

    const user= new userModel.create({
        username,
        email,
        password : hash
    })

    const token= jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:"1d"})

    res.status(201).json({
        message:"User Created successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

 /**
 * @name LoginController
 * @description Login an existing user, expects email and password in the request
 * @access Public
 */

 async function LoginController(req,res) {
    
 }  

 module.exports={registerUserController};