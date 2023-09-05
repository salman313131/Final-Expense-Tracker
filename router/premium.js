const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const premiumController = require('../controller/premium')

router.get('/premium',auth,premiumController.getPremiumDetails)
router.get('/monthly/',auth,premiumController.getMonthlyGraph)
router.get('/yearly/',auth,premiumController.getYearlyGraph)

module.exports = router