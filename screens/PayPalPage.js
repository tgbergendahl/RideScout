import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalPage = ({ type, months, onPaymentSuccess }) => {
  const [message, setMessage] = useState('');
  const cost = type === 'certified' ? 10 : 30;

  const initialOptions = {
    'client-id': 'ASxx84UqDdYC-bfdY_ajTGTi_TIfVHpF1oRmeUG9_uy1muW-qzXpcOog0PQrl54UocXqy23NtHoDaOPj', // Replace with your actual client ID
    'currency': 'USD',
    'disable-funding': 'credit,card',
  };

  const handleCreateOrder = async (data, actions) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: [
            {
              id: type === 'certified' ? 'certified_seller' : 'super_certified_seller',
              quantity: months,
              price: cost,
            },
          ],
        }),
      });

      const orderData = await response.json();
      if (orderData.id) {
        return orderData.id;
      } else {
        throw new Error('Could not create PayPal order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage(`Could not initiate PayPal Checkout...${error}`);
    }
  };

  const handleApprove = async (data, actions) => {
    try {
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const orderData = await response.json();
      if (orderData.status === 'COMPLETED') {
        onPaymentSuccess();
        setMessage(`Transaction completed successfully!`);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error) {
      console.error('Error capturing order:', error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={(err) => {
          console.error('PayPal error:', err);
          setMessage('There was an issue processing the payment. Please try again.');
        }}
      />
      {message && <p>{message}</p>}
    </PayPalScriptProvider>
  );
};

export default PayPalPage;
