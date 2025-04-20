const userSignUp=async(req,res)=> {
    const {email,password}=req.body
    if(!email || !password) {
        return res.status(400).json({message:"Email and password is required"})
    }
    let user = await User.findOne({email})
    if (user) {
        return res.status(400).json({message:"Email is already exist"})
    }
}

const userLogin=async(req,res)=> {

}

const getUser=async(req,res)=> {

}

module.exports={userLogin, userSignUp, getUser}