import React, { useState } from 'react';
import { View, Text, Alert, Image, ScrollView, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { useStripe } from '@stripe/stripe-react-native';
import logo from '../assets/RideScout.jpg';
import silverCheckmark from '../assets/silver_checkmark.png';
import goldCheckmark from '../assets/gold_checkmark.png';

const UpgradeAccount = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [type, setType] = useState('certified');
  const [months, setMonths] = useState(1);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    Array.from({ length: 24 }, (_, i) => ({ label: `${i + 1} month${i > 0 ? 's' : ''}`, value: i + 1 }))
  );
  const [message, setMessage] = useState('');

  const stripe = useStripe();

  const handleUpgrade = async () => {
    if (!user) {
      Alert.alert('Error', 'No user is currently logged in.');
      return;
    }

    const userDocRef = doc(db, 'RideScout/Data/Users', user.uid);
    const updates = type === 'certified' ? { isCertifiedSeller: true } : { isCertifiedDealer: true };
    const displayName = type === 'certified' ? 'CertifiedSeller' : 'CertifiedDealer';

    try {
      await updateDoc(userDocRef, updates);
      await updateProfile(user, { displayName });

      Alert.alert('Success', `Upgraded to ${displayName} successfully!`);
    } catch (error) {
      console.error('Error upgrading account:', error);
      Alert.alert('Error', 'There was an issue upgrading your account. Please try again.');
    }
  };

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const cost = type === 'certified' ? 8 : 20;
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: cost * months * 100 }), // amount in cents
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error fetching client secret:', error);
      setMessage('Error initiating payment. Please try again.');
    }
  };

  const handlePayment = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret();
    if (!clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: {
        name: user.displayName || 'Customer',
        email: user.email,
      },
    });

    if (error) {
      console.error('Payment confirmation error', error);
      Alert.alert('Error', error.message);
    } else if (paymentIntent) {
      console.log('Payment successful', paymentIntent);
      Alert.alert('Success', 'Payment successful');
      handleUpgrade();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Upgrade Your Account</Text>
      <Text style={styles.description}>
        The default account "Rider" allows up to three listings at a time on HogHub. By upgrading your account to CertifiedSeller, you'll have a silver checkmark and be able to post up to seven listings at the same time. This is recommended for people who regularly flip bikes and gear. If you are a dealership, you may want to upgrade to CertifiedDealer, allowing up to thirty listings at once. In doing so, you will receive the gold checkmark.
      </Text>
      <View style={styles.selectionContainer}>
        <Text style={styles.label}>Select Upgrade Type:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioButton}>
            <RadioButton value="certified" />
            <Text style={styles.radioButtonLabel}>Certified Seller - $8/month</Text>
            <Image source={silverCheckmark} style={styles.checkmark} />
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="dealer" />
            <Text style={styles.radioButtonLabel}>Certified Dealer - $20/month</Text>
            <Image source={goldCheckmark} style={styles.checkmark} />
          </View>
        </RadioButton.Group>
      </View>
      <View style={styles.selectionContainer}>
        <Text style={styles.label}>Select Number of Months:</Text>
        <DropDownPicker
          open={open}
          value={months}
          items={items}
          setOpen={setOpen}
          setValue={setMonths}
          setItems={setItems}
          containerStyle={{ height: 40 }}
          style={{ backgroundColor: '#fafafa' }}
          dropDownStyle={{ backgroundColor: '#fafafa' }}
        />
      </View>
      <TouchableOpacity style={styles.upgradeButton} onPress={handlePayment}>
        <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
      </TouchableOpacity>
      {message ? <Text>{message}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('RideScoutDisclaimer')}>
        <Text style={styles.disclaimerLink}>View Disclaimer and Guidelines</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  selectionContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  checkmark: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  upgradeButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disclaimerLink: {
    color: '#007BFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default UpgradeAccount;
