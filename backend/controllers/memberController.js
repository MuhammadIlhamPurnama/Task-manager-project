const { Member } = require('../models')

class MemberController {
  static async addNewMember(req,res,next) {
    try {
      const {name, role, email} = req.body

      const result = await Member.create({name, role, email})

      res.status(201).json({ message: 'Member created successfully', member: { id: result.id, name: result.name, role: result.role } })
    } catch (error) {
      next(error)
    }
    
  } 
}

module.exports = MemberController