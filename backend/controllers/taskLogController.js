const { Task, TaskLog } = require('../models');

class TaskLogController {
  static async getLogsByTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(Number(id));
      if (!task) throw { name: 'NotFound', message: 'Task not found' };

      const logs = await TaskLog.findAll({
        where: { taskId: Number(id) },
        order: [['createdAt', 'ASC']]
      });

      res.status(200).json({ message: `Successfully get logs for task ${task.title}`, logs });
    } catch (error) {
      next(error);
    }
  }

  static async addLogToTask(req, res, next) {
    try {
      const { id } = req.params;
      const { action, note } = req.body;

      const task = await Task.findByPk(Number(id));
      if (!task) throw { name: 'NotFound', message: 'Task not found' };

      const log = await TaskLog.create({
        taskId: Number(id),
        action: action || 'Manual Log',
        note: note || null
      });

      res.status(201).json({ message: 'Successfully add log to task', log });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskLogController;