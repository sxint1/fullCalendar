const Router = require('express')
const router = new Router()
const controller = require('../controllers/calendarController')
const authMiddleware = require('../middleware/authMiddleware')
const Event = require('../models/Event')

// router.post('/create-event', controller.createEvent)
router.post('/create-event', authMiddleware, controller.createEvent)
router.get('/get-events', authMiddleware, controller.getEvents)

module.exports = router