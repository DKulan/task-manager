const sgMail = require('@sendgrid/mail')


const sendgridAPIKey = process.env.SENDGRID_API
sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danny.kulangiev@gmail.com',
        subject: 'Welcome to my notes app!',
        text: `Welcome ${name} to the notes app!`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danny.kulangiev@gmail.com',
        subject: 'Sorry to see you go.',
        text: `Hi ${name}, your account has been removed and we are sorry to hear you go :(`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}