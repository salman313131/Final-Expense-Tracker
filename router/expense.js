const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const expenseController = require('../controller/expense')

router.get('/',auth,expenseController.getAllDetails)
router.get('/download',auth,expenseController.downloadFiles)
router.post('/add',auth,expenseController.postDetails)
router.delete('/:userId',auth,expenseController.deleteUser)
router.get('/all',expenseController.getDetail)

module.exports = router