const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const forgotController = require('../controller/forgot')

router.post('/password/forgotpassword',forgotController.resetPassword)
router.get('/password/resetpassword/:uniqueId',forgotController.getLink)
router.get('/password/update',forgotController.completedReset)
module.exports = router