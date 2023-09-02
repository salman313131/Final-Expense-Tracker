const express = require('express')
const router = express.Router()
const users = require('../controller/user')

router.post('/signup',users.addUser)
router.get('/',users.getUser)

module.exports = router