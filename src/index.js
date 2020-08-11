const app = require('./app')


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})

/*
    Seperate app.listen from index.js so we can import and test app with jest
 */