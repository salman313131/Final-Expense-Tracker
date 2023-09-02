const User =require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.addUser = async (req,res,next)=>{
    const {name,email,password} = req.body
    try {
        const user = await User.findOne({where:{email:email}})
        if(user){
            return res.status(409).json({message:'User Already exist'})
        }
        const salt=10
        const hashedPassword = await bcrypt.hash(password,salt)
        await User.create({name:name,email:email,password:hashedPassword})
        res.status(201).json({success:true})
    } catch (error) {
        res.status(500).json({message:'The Email already exists, Please Login or use different email!!!'})
    }
}

exports.getUser = async (req,res,next)=>{
    const {email,password} = req.query
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found!!' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'User not authorized!!' });
    }
    const tokenData = {userId:user.id}
    const accessToken = jwt.sign(tokenData,process.env.JWT_TOKEN)
    return res.json({user:user,token:accessToken});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}