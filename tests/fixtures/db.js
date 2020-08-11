const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')


const dummyUserId = new mongoose.Types.ObjectId()

const dummyUser = {
    _id: dummyUserId,
    name: 'test',
    email: 'test@gmail.com',
    password: 'testing123',
    tokens: [{
        token: jwt.sign({ _id: dummyUserId }, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(dummyUser).save()
}

module.exports = {
    dummyUserId,
    dummyUser,
    setupDatabase
}