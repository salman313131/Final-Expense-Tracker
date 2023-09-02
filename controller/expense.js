const Expense = require('../model/expense')
const Saveurl = require('../model/saveurl')
const User = require('../model/user')
const sequelize = require('../util/db')
const AWS = require('aws-sdk')

function uploadToS3(data,filename){
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_USER_KEY,
        secretAccessKey : process.env.AWS_USER_SECRET
    })
    var params={
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve,reject)=>{

        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                reject(error)
            }
            else{
                resolve(s3response.Location)
            }
        })
    })
}

exports.downloadFiles= async(req,res,next)=>{
    try {
        const expenses = await Expense.findAll({where:{userId:req.user.id}})
        const stringifyExpenses = JSON.stringify(expenses)
        const filename = `expenses${req.user.id}/${new Date()}.txt`
        const fileUrl = await uploadToS3(stringifyExpenses,filename)
        await Saveurl.create({url:fileUrl,userId:req.user.id})
        res.status(200).json({fileUrl,success:true})
    } catch (error) {
        res.status(500).json({error,message:'failed'})
    }
}

exports.getAllDetails=((req,res,next)=>{
    Expense.findAll({where:{userId:req.user.id}})
    .then(users=>{
        res.json({users,ispremium:req.user.ispremiumuser})
    }).catch(err=>console.log(err))
})
// exports.getDetail = ((req,res,next)=>{
//     const userId = req.params.userId
//     ExpenseDetail.findByPk(userId).then(response=>{
//         res.json({response})
//     }).catch(err=>console.log(err))
// })
exports.postDetails = (async(req,res,next)=>{
    const t = await sequelize.transaction()
    try {
        const jsonData = req.body
        const newExpenseData = Number(jsonData.spending)+Number(req.user.totalExpense)
        const newIncomeData = Number(jsonData.salary)+Number(req.user.totalSalary)
        console.log(newExpenseData,newIncomeData)
        const addExpense = Expense.create({day: jsonData.day,date: jsonData.date,month: jsonData.month,year: jsonData.year,salary: jsonData.salary,spending: jsonData.spending,category: jsonData.category,userId:req.user.id},{transaction:t})
        const addUserExpense = req.user.update({totalExpense:newExpenseData,totalSalary:newIncomeData},{transaction:t})
        const result = await Promise.all([addExpense,addUserExpense])
        await t.commit()
        res.status(201).json(result)
    } catch (error) {
        await t.rollback()
        console.log(error)
        res.status(500).json(error)
    }
})
exports.deleteUser = (async (req,res,next)=>{
    const t = await sequelize.transaction()
    try {
        const userId = req.params.userId
        const deleteUserDetail = await Expense.findOne({where:{id:userId},attributes:['salary','spending'],transaction:t})
        const newSpendingData = Number(req.user.totalExpense)-Number(deleteUserDetail.spending)
        const newSalaryData = Number(req.user.totalSalary)-Number(deleteUserDetail.salary)
        const updateUser = User.update({totalExpense:newSpendingData,totalSalary:newSalaryData},{where:{id:req.user.id},transaction:t})
        const deleteExpense = Expense.destroy({where:{id:userId},transaction:t})
        const result = await Promise.all([updateUser,deleteExpense])
        await t.commit();
        res.status(204).json(result);
    } catch (error) {
        await t.rollback();
        console.log(error)
        res.status(500).json(error)
    }

})