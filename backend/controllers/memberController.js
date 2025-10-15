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

  static async getMembers(req,res,next) {
    try {
      
      const members = await Member.findAll()

      res.status(200).json({message: "Successfully get members data", members})
    } catch (error) {
      next(error)
    }
  }

  static async getMemberById (req,res,next) {
    try {
      const {id} = req.params
     
      const member = await Member.findByPk(Number(id))
      
      if (!member) {
        throw {name: "NotFound", message: "Member not found"}
      }

      res.status(200).json({message: "Succesfully get member data", member})
    } catch (error) {
      next(error)
    }
  }

  static async updateMemberDataById (req,res,next) {
    try {
      const {id}  = req.params
      const {name, role, email} = req.body

      const member = await Member.findByPk(Number(id))

      if (!member) {
        throw {name: "NotFound", message: "Member not found"}
      }

      member.set({name, role, email})
      await member.validate(); 
      await member.save();

      res.status(200).json({message: `Successfully update ${member.name} data`, member})

    } catch (error) {
      next(error)
    }
  }

  static async deleteMemberById(req,res,next) {
    try {
      const {id}  = req.params

      const member = await Member.findByPk(Number(id))

      if (!member) {
        throw {name: "NotFound", message: "Member not found"}
      }

      await member.destroy()

      res.status(200).json({message: `Successfully delete ${member.name}`})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MemberController