require('dotenv').config()

var cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const calendarRoutes = require('./routes/calendarRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()
const port = process.env.PORT || 7000

app.use(cors())
app.use(express.json({ extended: true }))

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, () => { console.log('Database connected!') })

app.use('/api/auth', authRoutes)
app.use('/api/calendar', calendarRoutes)

app.listen(port, () => {
    console.log(`Server started on ${port}....`)
})