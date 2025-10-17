const { Task, Project, TaskLog } = require('../models')

class TaskController {
  static async getTasksByProject(req, res, next) {
    try {
      const { id } = req.params
      const project = await Project.findByPk(Number(id))
      if (!project) throw { name: 'NotFound', message: 'Project not found' }

      const tasks = await Task.findAll({ where: { projectId: Number(id) } })

      res.status(200).json({ message: `Successfully get tasks from project ${project.name}`, tasks })
    } catch (error) {
      next(error)
    }
  }

  static async getTaskById(req, res, next) {
    try {
      const { id } = req.params
      const task = await Task.findByPk(Number(id), { include: [{ model: Project, attributes: ['id', 'name'] }] })
      if (!task) throw { name: 'NotFound', message: 'Task not found' }

      res.status(200).json({ message: `Successfully get task ${task.title}`, task })
    } catch (error) {
      next(error)
    }
  }

  static async addNewTaskToProject(req, res, next) {
    try {
      const { id } = req.params 
      const { title, description, startDate, endDate, status, assignedId } = req.body

      const project = await Project.findByPk(Number(id))
      if (!project) throw { name: 'NotFound', message: 'Project not found' }

      const payload = {
        title,
        description,
        startDate,
        endDate,
        status: status || 'Pending',
        projectId: Number(id),
        assignedId
      }

      const result = await Task.create(payload)

      res.status(201).json({ message: `Successfully add task to project ${project.name}`, task: result })
    } catch (error) {
      next(error)
    }
  }

  static async updateTaskById(req, res, next) {
    try {
      const { id } = req.params
      const { title, description, startDate, endDate, status, assignedId } = req.body

      const task = await Task.findByPk(Number(id))
      if (!task) throw { name: 'NotFound', message: 'Task not found' }

      // Simpan status lama untuk logging
      const oldStatus = task.status

      task.set({ title, description, startDate, endDate, status, assignedId })
      await task.validate()
      await task.save()

      // Cek apakah ada perubahan status
      if (status && oldStatus !== status) {
        await TaskLog.create({
          taskId: task.id,
          action: 'Status Changed',
          note: `Changed from ${oldStatus || 'undefined'} to ${status}`
        })
      }

      res.status(200).json({ message: `Successfully update task ${task.title}`, task })
    } catch (error) {
      next(error)
    }
  }

  static async updateTaskStatus(req, res, next) {
    try {
      const { id } = req.params
      const { status } = req.body

      const task = await Task.findByPk(Number(id))
      if (!task) throw { name: 'NotFound', message: 'Task not found' }

      const oldStatus = task.status
      task.set({ status })
      await task.validate()
      await task.save()

      await TaskLog.create({
        taskId: task.id,
        action: 'Status Changed',
        note: `Changed from ${oldStatus || 'undefined'} to ${task.status}`
      })

      res.status(200).json({ message: `Successfully update status to ${task.status}`, task })
    } catch (error) {
      next(error)
    }
  }

  static async deleteTaskById(req, res, next) {
    try {
      const { id } = req.params

      const task = await Task.findByPk(Number(id))
      if (!task) throw { name: 'NotFound', message: 'Task not found' }

      await task.destroy()

      res.status(200).json({ message: `Successfully delete task ${task.title}` })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = TaskController