const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const previousController = require('../controller/previous')

router.get('/previous',auth,previousController.getPreviousDetails)

module.exports = router