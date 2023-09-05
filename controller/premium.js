const Expense = require('../model/expense')
exports.getPremiumDetails = (req,res,next)=>{
    try {
        res.status(200).json({salary:req.user.totalSalary,spending:req.user.totalExpense})
    } catch (error) {
        res.status(500).json(error)
    }
}
exports.getMonthlyGraph = async (req,res,next)=>{
    const month = req.query.month
    const year = req.query.year
    try {
        const response = await Expense.findAll({
            where:{userId:req.user.id,month:month,year:year},
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}
exports.getYearlyGraph = async (req,res,next)=>{
    const year = req.query.year
    try {
        const response = await Expense.findAll({
            where:{userId:req.user.id,year:year},
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}