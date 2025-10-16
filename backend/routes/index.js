const express = require('express')
const router = express.Router()
const userRouter = require('./user')
const memberRouter = require('./member')
const projectRouter = require('./project')
const taskRouter = require('./task')
const authentication = require('../middlewares/authentication')

router.use('/users', userRouter)
router.use(authentication)
router.use('/members', memberRouter)
router.use('/projects', projectRouter )
router.use('/tasks', taskRouter)

module.exports = router