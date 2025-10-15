const express = require('express')
const ProjectController = require('../controllers/projectController')
const router = express.Router()

router.post('/', ProjectController.addNewProject)
router.put('/:id', ProjectController.updateProjectById)
router.get('/', ProjectController.getProjects)
router.get("/:id", ProjectController.getProjectById)
router.delete('/:id', ProjectController.deleteProjectById)
router.post("/:id/members", ProjectController.addNewMemberToProject)
router.get("/:id/members", ProjectController.getProjectWithMembers)
router.delete('/:id/members/:memberId', ProjectController.deleteMemberFromProject)


module.exports = router