const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    dummyUser,
    dummyUserId,
    dummyUserTwo,
    dummyUserTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/db')

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

test('get all tasks for first dummy user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${dummyUser.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('should not delete other users tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${dummyUserTwo.tokens[0].token}`)
        .expect(404)

    // Confirm task wasn't deleted
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})