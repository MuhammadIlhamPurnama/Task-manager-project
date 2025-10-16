const express = require('express')
const DashboardController = require('../controllers/dashboardController')
const router = express.Router()

router.get('/', DashboardController.getDashboard)                       
router.get('/projects/:id/summary', DashboardController.getProjectSummary) 
router.get('/members/leaderboard', DashboardController.getMembersLeaderboard) 


module.exports = router