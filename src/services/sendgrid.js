// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (to, subject, content) => {
    const msg = {
        to: to, // Change to your recipient
        from: 'info@devchuks.com', // Change to your verified sender
        subject: subject,
        // text: "and easy to do anywhere, even with Node.js",
        html: content,
    }
    await sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
            return error
        })
}

module.exports = {
    sendMail,
}
