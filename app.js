//dotenv
require("dotenv").config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')


//database
const sequelize = require('./util/db')

//Routers
const userRouter = require('./router/user')
const expenseRouter = require('./router/expense')
const orderRouter = require('./router/purchase')
const forgotRouter = require('./router/forgot')

//Modal
const User = require('./model/user')
const Expense = require('./model/expense')
const Order = require('./model/order')
const Forgot = require('./model/forgot')

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());

//api
app.use('/api/v1',userRouter)
app.use('/api/v1/expense',expenseRouter)
app.use('/purchase',orderRouter)
app.use('/',forgotRouter)

//Modal Associations
User.hasMany(Expense)
Expense.belongsTo(User)
User.hasMany(Order)
Order.belongsTo(User)
User.hasMany(Forgot)
Forgot.belongsTo(User)

//datbase sync
sequelize.sync().then(()=>{
    app.listen(8000)
}).catch(err=>console.log(error))