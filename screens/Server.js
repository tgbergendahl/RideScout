require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define the route for submitting the signup form
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Setup email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jared@ridescout.net',
      subject: 'New Signup',
      text: `Username: ${username}\nPassword: ${password}`, // For security reasons, avoid sending plain text passwords
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    // Respond with a success message or URL for the frontend to navigate
    res.status(200).json({ message: 'Signup successful. Redirect to login.', redirectUrl: '/login' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
