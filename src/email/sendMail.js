const nodemailer = require('nodemailer');

const username = process.env.SMTP_USERNAME;
const password = process.env.SMTP_PASSWORD;
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const sender = process.env.SMTP_SENDER;
const rejectUnauthorized = process.env.SMTP_BLOCK_SELF_SIGNED_CERT === 'true';
const secure = process.env.SMTP_SECURE === 'true';

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  tls: {
    rejectUnauthorized
  },
  auth: {
    user: username,
    pass: password
  }
});

async function sendMail(to, subject, content) {
  let mailOptions = {
    from: `${sender} <${username}>`,
    to: to,
    subject: subject,
    text: content
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendMail;
