const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { dummyUser, dummyUserId, setupDatabase } = require('./fixtures/db')

// Delete all users from DB and create dummy user
beforeEach(setupDatabase)

test('should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: "Daniel",
            email: "example@gmail.com",
            password: "something1234"
        })
        .expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: "Daniel",
            email: "example@gmail.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('something1234')
})

test('should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: dummyUser.email,
            password: dummyUser.password
        })
        .expect(200)

    const user = await User.findById(response.body.user._id)

    expect(user.tokens[1].token).toBe(response.body.token)
})

test('should NOT login non-existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'thisshouldfail@gmail.com',
            password: 'somethingrandom'
        })
        .expect(400)
})

test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${dummyUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should NOT get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${dummyUser.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(dummyUserId)

    expect(user).toBeNull()
})

test('should NOT delete account for unathenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${dummyUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile_pic.jpg')
        .expect(200)

    const user = await User.findById(dummyUserId)

    expect(user.avatar).toEqual(expect.any(Buffer))  // toEqual uses == instead of === to compare objects
})

test('should update user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${dummyUser.tokens[0].token}`)
        .send({
            name: 'Dan'
        })
        .expect(200)

    const user = await User.findById(dummyUserId)

    expect(user.name).toBe('Dan')
})

test('should NOT update invalid fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${dummyUser.tokens[0].token}`)
        .send({
            location: 'toronto'
        })
        .expect(400)
})