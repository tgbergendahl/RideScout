import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [clientSecret, setClientSecret] = useState('');

  const fetchPaymentIntent = async () => {
    try {
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // amount in cents
      });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error fetching payment intent:', error);
    }
  };

  const handlePayPress = async () => {
    if (!clientSecret) return;

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: {
        // Add optional billing details here
      },
    });

    if (error) {
      console.log('Payment confirmation error', error);
      Alert.alert('Error', error.message);
    } else if (paymentIntent) {
      console.log('Payment successful', paymentIntent);
      Alert.alert('Success', 'Payment successful');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Payment Intent" onPress={fetchPaymentIntent} />
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
      />
      <Button title="Pay" onPress={handlePayPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
  cardContainer: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
});

export default PaymentScreen;
