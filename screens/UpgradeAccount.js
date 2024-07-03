import React, { useState } from 'react';
import { View, Text, Alert, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { useStripe, CardField } from '@stripe/stripe-react-native'; // Import Stripe components
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

  const { confirmPayment } = useStripe(); // Stripe hook

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

  const handlePaymentSuccess = () => {
    handleUpgrade();
  };

  const handleCreatePayment = async () => {
    try {
      const cost = type === 'certified' ? 8 : 20;

      const { paymentIntent, error } = await confirmPayment('client_secret_from_backend', {
        type: 'Card',
        billingDetails: {
          name: user.displayName,
          email: user.email,
        },
      });

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
        return;
      }

      if (paymentIntent) {
        handlePaymentSuccess();
        setMessage('Payment successful!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage(`Error: ${error.message}`);
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
      <TouchableOpacity style={styles.upgradeButton} onPress={handleCreatePayment}>
        <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
      </TouchableOpacity>
      <View style={{ height: 200, marginTop: 20, width: '100%' }}>
        <CardField
          postalCodeEnabled={true}
          placeholder={{
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
      </View>
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
