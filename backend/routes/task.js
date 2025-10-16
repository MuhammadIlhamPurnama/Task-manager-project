const express = require('express')
const TaskController = require('../controllers/taskController')
const TaskLogController = require('../controllers/taskLogController')
const router = express.Router()


router.get('/:id', TaskController.getTaskById)
router.put('/:id', TaskController.updateTaskById)
router.patch('/:id/status', TaskController.updateTaskStatus)
router.delete('/:id', TaskController.deleteTaskById)

router.get('/:id/logs', TaskLogController.getLogsByTask)
router.post('/:id/logs', TaskLogController.addLogToTask)


module.exports = router