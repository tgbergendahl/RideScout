require('dotenv').config();
const express = require('express');
const stripe = require('stripe')('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');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
