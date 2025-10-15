const express = require('express')
const router = express.Router()
const userRouter = require('./user')
const memberRouter = require('./member')
const authentication = require('../middlewares/authentication')

router.use('/users', userRouter)
router.use(authentication)
router.use('/members', memberRouter)

module.exports = router