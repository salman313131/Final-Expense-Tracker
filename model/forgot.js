const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const Forgot = sequelize.define('forgotpasswordrequests',{
    id:{
        type: Sequelize.STRING,
        allowNull:false,
        primaryKey:true,
    },
    isactive:{
        type:Sequelize.BOOLEAN
    }
})

module.exports = Forgot