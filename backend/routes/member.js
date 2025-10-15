const express = require('express')
const MemberController = require('../controllers/memberController')
const router = express.Router()

router.post('/', MemberController.addNewMember)

module.exports = router

