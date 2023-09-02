const jwt = require('jsonwebtoken')
const User = require('../model/user')
function auth(req,res,next){
    const authHeader = req.headers['authorization']
    if(authHeader==null){
        return res.status(401).json({success:false})
    }
    const users = jwt.verify(authHeader,process.env.JWT_TOKEN)
    User.findByPk(users.userId).then(user=>{
        req.user=user
        next()
    }).catch(err=>console.log('auth error'))
}

module.exports = auth