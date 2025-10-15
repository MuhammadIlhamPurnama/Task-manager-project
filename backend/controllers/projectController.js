const { Project } = require('../models')

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
      const projects = await Project.findAll()

      res.status(200).json({message: "Successfully get all projects", projects})
    } catch (error) {
      next(error)
    }
  }

  static async getProjectById(req,res,next) {
    try {
      const {id} = req.params

      const project = await Project.findByPk(Number(id))

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
}

module.exports = ProjectController