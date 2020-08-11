const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { dummyUser, dummyUserId, setupDatabase } = require('./fixtures/db')

// Delete all users from DB and create dummy user
beforeEach(setupDatabase)

test('should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${dummyUser.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)

    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})