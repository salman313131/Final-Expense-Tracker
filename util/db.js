const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-component','salman@786','jaan@123',{
    dialect:'mysql',
    host: 'localhost'
})

module.exports=sequelize