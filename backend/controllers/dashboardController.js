const { sequelize, Project, Task, Member, ProjectMember, TaskLog } = require('../models')
const { Op } = require('sequelize')

class DashboardController {
  static async getDashboard(req, res, next) {
    try {
      const totalProjects = await Project.count()
      const totalTasks = await Task.count()

      const tasksByStatus = await Task.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true
      })

      const membersSummary = await Member.findAll({
        attributes: [
          'id',
          'name',
          [sequelize.fn('COUNT', sequelize.col('ProjectMembers.projectId')), 'projectsCount'],
          [sequelize.fn('COUNT', sequelize.col('Tasks.id')), 'tasksAssigned'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN "Tasks"."status" IN ('Done','Selesai','Completed') THEN 1 ELSE 0 END`)), 'tasksCompleted']
        ],
        include: [
          { model: ProjectMember, attributes: [] },
          { model: Task, as: 'Tasks', attributes: [], include: [], required: false }
        ],
        group: ['Member.id'],
        order: [[sequelize.literal('"tasksAssigned"'), 'DESC']],
        raw: true
      })

      res.status(200).json({
        message: 'Dashboard summary',
        totals: { totalProjects, totalTasks },
        tasksByStatus,
        membersSummary
      })
    } catch (error) {
      next(error)
    }
  }

  static async getProjectSummary(req, res, next) {
    try {
      const { id } = req.params
      const project = await Project.findByPk(Number(id))
      if (!project) throw { name: 'NotFound', message: 'Project not found' }

      const totalTasks = await Task.count({ where: { projectId: Number(id) } })

      const tasksByStatus = await Task.findAll({
        where: { projectId: Number(id) },
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true
      })

      const tasksPerMember = await Task.findAll({
        where: { projectId: Number(id) },
        attributes: [
          ['assignedId', 'memberId'],
          [sequelize.fn('COUNT', sequelize.col('Task.id')), 'tasksAssigned'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN "Task"."status" IN ('Done','Selesai','Completed') THEN 1 ELSE 0 END`)), 'tasksCompleted']
        ],
        include: [{ model: Member, as: 'Assignee', attributes: ['id','name'] }],
        group: [sequelize.literal(`"Task"."assignedId"`), sequelize.literal(`"Assignee"."id"`), sequelize.literal(`"Assignee"."name"`)],
        order: [[sequelize.literal('"tasksAssigned"'), 'DESC']],
        raw: true
      })

      res.status(200).json({
        message: `Project summary for ${project.name}`,
        project: { id: project.id, name: project.name },
        totalTasks,
        tasksByStatus,
        tasksPerMember
      })
    } catch (error) {
      next(error)
    }
  }

   static async getMembersLeaderboard(req, res, next) {
    try {
      const leaderboard = await Member.findAll({
        attributes: [
          'id',
          'name',
          [sequelize.fn('COUNT', sequelize.col('Tasks.id')), 'tasksAssigned']
        ],
        include: [
          { model: Task, attributes: [], required: false }
        ],
        group: ['Member.id'],
        order: [[sequelize.literal('"tasksAssigned"'), 'DESC']],
        limit: 20,
        raw: true,
        subQuery: false
      })

      res.status(200).json({ message: 'Members leaderboard', leaderboard })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = DashboardController