const { Project, ProjectMember, Member, Task } = require('../models')
const { Op } = require('sequelize')

class ProjectController {
  static async addNewProject(req,res,next) {
    try {
      const {name, description, startDate, endDate, status} = req.body

      const result = await Project.create({name, description, startDate, endDate, status})

      res.status(201).json({message: "Successfully create project", project: result})
    } catch (error) {
      next(error)
    }
  }

  static async updateProjectById(req,res,next) {
    try {
      const {id} = req.params
      const {name, description, startDate, endDate, status} = req.body

      const project = await Project.findByPk(Number(id))

      if (!project) {
        throw {name: "NotFound", message: "Project not found"}
      }

      project.set({name, description, startDate, endDate, status})

      await project.validate()
      await project.save()

      res.status(200).json({message: `Successfully update project ${project.name}`})

    } catch (error) {
      next(error)
    }
  }

  static async getProjects(req,res,next){
    try {
      let { page = 1, limit = 6, sort, status, search } = req.query

      page = +page
      limit = +limit

      const offset = (page - 1) * limit

      let queryOption = {
        limit,
        offset,
        where: {},
        order: [],
        include: [
          {
            model: Member,
            attributes: ['id', 'name', 'role', 'email'],
            through: { attributes: [] }
          }
        ]
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

      // === FILTER BY STATUS ===
      if (status) {
        queryOption.where.status = status
      }

      // === SEARCH === (by name or description)
      if (search) {
        queryOption.where[Op.or] = [
          {
            name: {
              [Op.iLike]: `%${search}%`
            }
          }
        ]
      }

      // === Query projects
      const { rows: projects, count: totalItems } = await Project.findAndCountAll(queryOption)

      const totalPages = Math.ceil(totalItems / limit)

      res.status(200).json({
        message: "Successfully get all projects",
        projects,
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

  static async getProjectById(req,res,next) {
    try {
      const {id} = req.params

      const project = await Project.findByPk(Number(id), {
        include: [
          {
            model: Member,
            attributes: ['id', 'name', 'role', 'email'],
            through: { attributes: [] } // hilangkan data pivot ProjectMember
          },
          {
            model: Task,
            attributes: ['id', 'title', 'description', 'status', 'startDate', 'endDate',  'assignedId'],
            include: [
              {
                model: Member,
                as: 'Assignee',
                attributes: ['id', 'name', 'email']
              }
            ]
          }
        ]
      })

      if (!project) {
        throw {name: "NotFound", message: "Project not found"}
      }

      res.status(200).json({message: `Successfully get project ${project.name}`, project})
    } catch (error) {
      next(error)
    }
  }

  static async deleteProjectById(req,res,next) {
    try {
      const {id} = req.params

      const project = await Project.findByPk(id)

      if (!project) {
        throw {name: "NotFound", message: "Project not found"}
      }

      await project.destroy()

      res.status(200).json({message: `Successfully delete project ${project.name}`})
    } catch (error) {
      next(error)
    }
  }

  static async addNewMemberToProject(req,res,next) {
    try {
      const projectId = req.params.id
      const { memberId } = req.body

      const checkProject = await Project.findByPk(projectId)

      if (!checkProject) {
        throw {name: "NotFound", message: "Project not found"}
      }

      const checkMember = await Member.findByPk(memberId)

      if (!checkMember) {
        throw {name: "NotFound", message: "Member not found"}
      }

      // Check if member already in project
      const existingMember = await ProjectMember.findOne({
        where: { projectId, memberId }
      })

      if (existingMember) {
        throw {name: "BadRequest", message: "Member already in this project"}
      }
      
      const result = await ProjectMember.create({projectId, memberId})

      res.status(201).json({message: "Successfully add member to project"})
    } catch (error) {
      next(error)
    }
  }

  static async getMembersFromProject(req,res,next) {
    try {
      const {id} = req.params

      const members = await ProjectMember.findAll({where: { projectId: id}})

      res.status(200).json({message: "Successfully get members from project", members})
    } catch (error) {
      next(error)
    }
  }

  static async getProjectWithMembers(req, res, next) {
    try {
      const { id } = req.params
      const project = await Project.findByPk(Number(id), {
        include: [{
          model: Member,
          attributes: ['id', 'name', 'role', 'email'],
          through: { attributes: [] } // hilangkan data pivot jika tidak perlu
        }]
      })

      if (!project) throw { name: 'NotFound', message: 'Project not found' }

      res.status(200).json({
        message: 'Successfully get project with members',
        project
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteMemberFromProject(req,res,next) {  
    try {
      const { id, memberId } = req.params

      const project = await Project.findByPk(Number(id))
      if (!project) {
        throw { name: "NotFound", message: "Project not found" }
      }

      const member = await Member.findByPk(Number(memberId))
      if (!member) {
        throw { name: "NotFound", message: "Member not found" }
      }

      const projectMember = await ProjectMember.findOne({
        where: { projectId: Number(id), memberId: Number(memberId) }
      })

      if (!projectMember) {
        throw { name: "NotFound", message: "Member not associated with this project" }
      }

      await projectMember.destroy()

      res.status(200).json({ message: `Successfully delete ${member.name} from project ${project.name}` })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ProjectController