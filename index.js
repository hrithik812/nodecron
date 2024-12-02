const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hrithik08.rudra@gmail.com', // Your email
        pass: 'fjmt kczq szjh zbnr',        // Your app password (not account password)
    },
});

// Schedule Email Sending
cron.schedule('0 18 * * *', async () => {
    try {
        await transporter.sendMail({
            from: '"Your App" <hrithik08.rudra@gmail.com>',
            to: 'bipasha123das@gmail.com',
            subject: 'Scheduled Email',
            text: 'This is an automated email sent at 6 PM daily.',
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
