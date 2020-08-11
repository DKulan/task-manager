const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


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

const dummyUserTwoId = new mongoose.Types.ObjectId()
const dummyUserTwo = {
    _id: dummyUserTwoId,
    name: 'test2',
    email: 'test2@gmail.com',
    password: 'testing1234',
    tokens: [{
        token: jwt.sign({ _id: dummyUserTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: dummyUser._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: dummyUser._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: dummyUserTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(dummyUser).save()
    await new User(dummyUserTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    dummyUserId,
    dummyUser,
    dummyUserTwoId,
    dummyUserTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}