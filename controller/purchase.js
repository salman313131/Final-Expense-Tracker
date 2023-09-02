const Razorpay = require('razorpay')
const Order = require('../model/order')
const {RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET} = process.env
exports.purchasePremium =  async (req,res,next)=>{
    try {
        var rzp = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET
        })
        const amount = 2500
        const order = await rzp.orders.create({ amount, currency: 'INR' })
        await Order.create({ orderid: order.id, status: 'PENDING', userId: req.user.id });
        return res.json({ order, key_id: rzp.key_id });
    } catch (error) {
        res.status(500).json({message:'controller Error'})
    }
}

exports.purchaseUpdate = async (req,res,next)=>{
    try{
        const {payment_id,order_id} = req.body
        const order = await Order.findOne({where:{orderid:order_id}})
        const promise1 = req.user.update({ispremiumuser:true})
        const promise2 = order.update({paymentid:payment_id,status:'SUCCESS'})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({success:true,message:'Transaction completed!!'})
        }).catch(err=>{
            throw new Error(err)
        })
    } catch(error){
        res.status(403).json({err:error,message:'Something went Wrong'})
    }
}