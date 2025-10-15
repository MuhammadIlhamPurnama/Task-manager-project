const express = require('express')
const MemberController = require('../controllers/memberController')
const router = express.Router()

router.get('/', MemberController.getMembers)
router.get('/:id', MemberController.getMemberById)
router.post('/', MemberController.addNewMember)
router.put('/:id', MemberController.updateMemberDataById)
router.delete('/:id', MemberController.deleteMemberById)

module.exports = router

