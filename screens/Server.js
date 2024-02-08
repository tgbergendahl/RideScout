const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Define the route for submitting the signup form
app.post('/signup', (req, res) => {
  const { username, password } = req.body;


  // Send an email with the form data
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'YOUR_EMAIL',
      pass: 'YOUR_PASSWORD',
    },
  });


  const mailOptions = {
    from: 'YOUR_EMAIL',
    to: 'jared@ridescout.net',
    subject: 'New Signup',
    text: `Username: ${username}\nPassword: ${password}`,
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.redirect('/login'); // Redirect to the login page after successful submission
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
