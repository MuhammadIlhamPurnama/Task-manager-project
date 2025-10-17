const { Member } = require('../models')
const { Op } = require('sequelize')

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
      let { page = 1, limit = 10, sort, role, search } = req.query

      page = +page
      limit = +limit

      const offset = (page - 1) * limit

      let queryOption = {
        limit,
        offset,
        where: {},
        order: [],
        attributes: ['id', 'name', 'role', 'email', 'createdAt', 'updatedAt']
      }

      // === SORT ===
      if (sort && typeof sort === "string") {
        if (sort.charAt(0) === "-") {
          queryOption.order.push([sort.slice(1), "DESC"])
        } else {
          queryOption.order.push([sort, "ASC"])
        }
      } else {
        // Default sort by createdAt DESC
        queryOption.order.push(["createdAt", "DESC"])
      }

      // === FILTER BY ROLE ===
      if (role) {
        queryOption.where.role = {
          [Op.iLike]: `%${role}%`
        }
      }

      // === SEARCH === (by name or email)
      if (search) {
        queryOption.where[Op.or] = [
          {
            name: {
              [Op.iLike]: `%${search}%`
            }
          },
          {
            email: {
              [Op.iLike]: `%${search}%`
            }
          }
        ]
      }

      // === Query members
      const { rows: members, count: totalItems } = await Member.findAndCountAll(queryOption)

      const totalPages = Math.ceil(totalItems / limit)

      res.status(200).json({
        message: "Successfully get members data",
        members,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit
        }
      })
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