import React, { useState, useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const ShopRideScout = () => {
  const { confirmPayment } = useStripe();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1000 }), // Amount in cents
    })
    .then((res) => res.json())
    .then((data) => {
      setClientSecret(data.clientSecret);
    })
    .catch((error) => console.error('Error fetching client secret:', error));
  }, []);

  const handlePayment = async () => {
    if (!clientSecret) return;

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: {
        email: 'email@example.com',
      },
    });

    if (error) {
      Alert.alert('Payment failed', error.message);
    } else if (paymentIntent) {
      Alert.alert('Payment successful', `PaymentIntent ID: ${paymentIntent.id}`);
    }
  };

  return (
    <View>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
      />
      <Button title="Pay" onPress={handlePayment} />
    </View>
  );
};

export default ShopRideScout;
