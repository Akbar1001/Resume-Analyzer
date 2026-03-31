const userModel=require("../models/user.model");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const tokenblacklistModel=require("../models/blacklist.model");

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

    const isUserAlreadyexists= await userModel.findOne({
        $or:[{username},{email}]    // check on the username OR email
    })

    if(isUserAlreadyexists){
        return res.status(400).json({
            message:"User with the same username or email already exists"
        })
    }

    const hash= await bcrypt.hash(password,10);

    const user= await userModel.create({
        username,
        email,
        password : hash
    })

    const token= jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token);
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

    const {email,password}=req.body;

    const user= await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message:"User with this email doesnot exists"
        })
    }

    const ispasswordValid= await bcrypt.compare(password,user.password);
    if(!ispasswordValid){
        return res.status(400).json({ 
            message:"Invalid password for this user"
        })
    }

    const token= jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token);
    return res.status(200).json({
        message:"User LoggedIn Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        } 
    })

 }  

 /**
 * @name LogoutController
 * @description Logout user with tokenblacklisting
 * @access Public
 */

 async function LogoutController(req,res) {
    
    const token=req.cookies.token;
    if(token){
        await tokenblacklistModel.create({token})
    }

    res.clearCookie("token");

    res.status(200).json({
        message:"User Logged out successfully"
    })

 }

 module.exports={registerUserController,LoginController,LogoutController}; 