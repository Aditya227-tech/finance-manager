const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports (e.g., SendGrid), see the Nodemailer documentation.
// For more information, see: https://nodemailer.com/transports/
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.

  const mailOptions = {
    from: '"Finance Tracker" <noreply@firebase.com>',
    to: email,
    subject: "Welcome to Finance Tracker!",
    html: `<h1>Welcome to Finance Tracker, ${displayName || ''}!</h1>
           <p>We're excited to have you on board. Get started by tracking your income and expenses.</p>`
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error.toString());
    }
    console.log('Sended: ' + info.response);
  });
});
