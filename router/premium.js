const express = require('express')
const router = express.Router()
const premiumController = require('../controller/premium')

router.get('/premium',premiumController.getPremiumDetails)

module.exports = router