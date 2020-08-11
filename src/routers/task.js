const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')


const router = new express.Router()


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sort) {
        const parts = req.query.sort.split(':')
        sort[parts[0]] = parts[1]
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const ACCEPTED_FIELDS = ["description", "complete"]
    const fieldNames = Object.keys(req.body)
    const shouldUpdateFields = fieldNames.every((fieldName) => ACCEPTED_FIELDS.includes(fieldName))

    if (!shouldUpdateFields) {
        return res.status(400).send({error: 'Invalid field names!'})
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        fieldNames.forEach((fieldName) => task[fieldName] = req.body[fieldName])

        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })

        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router