const { Schema, model } = require('mongoose')

const Event = new Schema({
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date
    },
    title: {
        type: String,
        required: true
    },
    userId: {
        type: String
    }
})


module.exports = model('Event', Event)