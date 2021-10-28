const router = require('express').Router()
const Event = require('../models/Event')
const moment = require('moment')



class calendarController {
    async createEvent(req, res) {
        const event = new Event({
            start: req.body.start,
            end: req.body.end,
            title: req.body.title,
            userId: req.user.id
        })
        console.log(event);
        await event.save()
        res.sendStatus(201)
    }

    async getEvents(req, res) {
        const events = await Event.find({
            start: { $gte: moment(req.query.start).toDate() },
            end: { $lte: moment(req.query.end).toDate() },
            userId: req.user.id
        })
        res.send(events)
    }
}

module.exports = new calendarController()