const express = require('express')
const ProjectController = require('../controllers/projectController')
const router = express.Router()

router.post('/', ProjectController.addNewProject)
router.put('/:id', ProjectController.updateProjectById)
router.get('/', ProjectController.getProjects)
router.get("/:id", ProjectController.getProjectById)
router.delete('/:id', ProjectController.deleteProjectById)

module.exports = router