const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const Saveurl = sequelize.define('saveurl',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true,
    },
    url:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = Saveurl