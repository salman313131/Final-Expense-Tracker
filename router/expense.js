const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const expenseController = require('../controller/expense')

router.get('/',auth,expenseController.getAllDetails)
router.post('/add',auth,expenseController.postDetails)
router.delete('/:userId',auth,expenseController.deleteUser)
// router.get('/:userId',expenseController.getDetail)

module.exports = router