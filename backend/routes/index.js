const express = require('express')
const router = express.Router()
const userRouter = require('./user')
const memberRouter = require('./member')
const authentication = require('../middlewares/authentication')

router.use('/user', userRouter)
router.use(authentication)
router.use('/member', memberRouter)

module.exports = router