const User=require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const userSignUp=async(req,res)=> {
    const {email,password}=req.body
    if(!email || !password) {
        return res.status(400).json({message:"Email and password is required"})
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Email already exists"
        });
    }

    // let user = await User.findOne({email})
    // if (user) {
    //     return res.status(400).json({message:"Email is already exist"})
    // }
    const hashPwd = await bcrypt.hash(password,10)
    const newUser = await User.create({
        email, password:hashPwd
    })
    let token = jwt.sign({email, id:newUser._id},process.env.SECRET_KEY, { expiresIn: '1h' })
    return res.status(201).json({success: true, token,user:{ id: newUser._id, email: newUser.email }, expiresIn: 3600})
}

const userLogin=async(req,res)=> {
    const {email,password}=req.body
    if(!email || !password) {
        return res.status(400).json({message:"Email and password is required"})
    }
    let user = await User.findOne({email})
    if (user && await bcrypt.compare(password,user.password)) {
        let token = jwt.sign({email, id:user._id},process.env.SECRET_KEY)
        return res.status(200).json({token,user})
    } else {
        return res.status(400).json({error:"Invalid credentials"})
    }

}

const getUser=async(req,res)=> {
    const user = await User.findById(req.params.id)
    res.json({email:user.email})
}

module.exports={userLogin, userSignUp, getUser}