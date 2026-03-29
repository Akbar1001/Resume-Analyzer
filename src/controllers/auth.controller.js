 const userModel=require("../models/user.model");


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

 }

 module.exports={registerUserController};