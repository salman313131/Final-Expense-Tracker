const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const orderController = require('../controller/purchase')

router.get('/premium',auth,orderController.purchasePremium)
router.post('/update',auth,orderController.purchaseUpdate)

module.exports = router