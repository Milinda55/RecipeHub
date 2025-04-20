const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
}, {timeStamp:true})

module.exports=mongoose.model("User", userSchema)