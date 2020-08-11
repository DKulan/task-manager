const express = require('express')

// Connect to DB
require('./db/mongoose')

// Setup Routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// express middleware for maintenance mode
// app.use((req, res, next) => {
//     res.status(503).send({
//         error: 'API is under maintenance'
//     })
// })

// express parses JSON and returns it via req.body
app.use(express.json())

// connect app with routers
app.use(userRouter)
app.use(taskRouter)

module.exports = app