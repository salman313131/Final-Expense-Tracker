const { v4: uuidv4 } = require('uuid')
const Forgot = require('../model/forgot')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SibApiV3Sdk = require('sib-api-v3-sdk')
const path = require('path')
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const root = require('../util/path')

exports.resetPassword = async (req,res,next)=>{
    try {
        const resetEmail = req.body.email
        const uniqueId = uuidv4()
        const user = await User.findOne({where:{email:resetEmail},arrtibutes:['id']})
        await Forgot.create({id:uniqueId,isactive:true,userId:user.id})
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.SENDIN_API_KEY;
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sender={
            email:'luciferzomer@gmail.com'
        }
        const receiver = [
            {
                email: resetEmail
            }
        ]
        apiInstance.sendTransacEmail({
            sender,
            to:receiver,
            subject: 'Forgot Password',
            htmlContent: `<a href="http://localhost:8000/password/resetpassword/${uniqueId}">Click to reset password</a>`
        }).then(result=>{
            res.json({message:'Successfully updated'})
        }).catch(err=>{
            console.log(err)
            throw new Error(err)
        })
    } catch (error) {
        console.log(error)
    }
}

exports.getLink = async (req,res,next)=>{
    const uuid = req.params.uniqueId
    try {
        const result = await Forgot.findOne({where:{id:uuid}})
        if(result){
            await Forgot.update({isactive:false},{where:{id:uuid}})
            const filePath = path.join(root, 'public', 'forgot.html')
            res.sendFile(filePath)

        }else{

            res.json({message:'something went wrong'})
        }
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

exports.completedReset = async (req,res,next)=>{
        const { email,password } = req.query
    try {
        const salt=10
        const hashedPassword = await bcrypt.hash(password,salt)
        await User.update({password:hashedPassword},{where:{email:email}})
        res.json({success:true})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}