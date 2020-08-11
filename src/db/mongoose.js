const mongoose = require('mongoose')


const dbName = 'task-manager'

mongoose.connect(`${process.env.MONGODB_URL}/${dbName}?retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})