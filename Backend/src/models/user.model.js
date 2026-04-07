const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username Already taken"],
        required:true,
    },
    email:{
        type:String,
        unique:[true,"Account with this email address already exist"],
        required:true
    },
    password:{
        type:String,
        required:true,
    }

})

const userModel=mongoose.model("users",userSchema);

module.exports=userModel