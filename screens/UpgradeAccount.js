import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Image, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import logo from '../assets/RideScout.jpg';
import silverCheckmark from '../assets/silver_checkmark.png';
import goldCheckmark from '../assets/gold_checkmark.png';
import visa from '../assets/visa.png';
import mastercard from '../assets/mastercard.png';
import amex from '../assets/amex.png';
import discover from '../assets/discover.png';
import Rider from '../assets/RS.png'

const UpgradeAccount = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [type, setType] = useState('rider');
  const [currentAccountType, setCurrentAccountType] = useState('Rider');
  const [message, setMessage] = useState('');

  const { confirmPayment, retrievePaymentIntent } = useStripe();

  useEffect(() => {
    const fetchUserType = async () => {
      if (user) {
        const userDocRef = doc(db, 'RideScout/Data/Users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isCertifiedSeller) {
            setCurrentAccountType('Certified Seller');
            setType('certified');
          } else if (userData.isCertifiedDealer) {
            setCurrentAccountType('Certified Dealer');
            setType('dealer');
          }
        }
      }
    };
    fetchUserType();
  }, [user]);

  const handleUpgrade = async () => {
    if (!user) {
      Alert.alert('Error', 'No user is currently logged in.');
      return;
    }

    const userDocRef = doc(db, 'RideScout/Data/Users', user.uid);
    const updates = type === 'certified' ? { isCertifiedSeller: true } : type === 'dealer' ? { isCertifiedDealer: true } : {};
    const displayName = type === 'certified' ? 'CertifiedSeller' : type === 'dealer' ? 'CertifiedDealer' : 'Rider';

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

  const handleCreateSubscription = async () => {
    if (type === 'rider') {
      handleUpgrade();
      return;
    }

    try {
      const priceId = type === 'certified' ? 'price_for_certified' : 'price_for_dealer'; // Replace with your actual price IDs
      const email = user.email;
      const billingDetails = {
        email: user.email,
        name: user.displayName,
      };

      const { paymentIntent, error } = await confirmPayment('client_secret_from_backend', {
        type: 'Card',
        billingDetails,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Upgrade Your Account</Text>
        <Text style={styles.description}>
          The default account "Rider" allows up to three listings at a time on HogHub. By upgrading your account to CertifiedSeller, you'll have a silver checkmark and be able to post up to seven listings at the same time. This is recommended for people who regularly flip bikes and gear. If you are a dealership, you may want to upgrade to CertifiedDealer, allowing up to thirty listings at once. In doing so, you will receive the gold checkmark.
        </Text>
        <View style={styles.selectionContainer}>
          <Text style={styles.label}>Select Account Type:</Text>
          <RadioButton.Group onValueChange={value => setType(value)} value={type}>
            <View style={styles.radioButton}>
              <RadioButton value="rider" />
              <Text style={styles.radioButtonLabel}>Rider - $0/month {currentAccountType === 'Rider' && '(You currently have this account type)'}</Text>
              <Image source={Rider} style={styles.checkmark} />
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="certified" />
              <Text style={styles.radioButtonLabel}>Certified Seller - $8/month {currentAccountType === 'Certified Seller' && '(You currently have this account type)'}</Text>
              <Image source={silverCheckmark} style={styles.checkmark} />
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="dealer" />
              <Text style={styles.radioButtonLabel}>Certified Dealer - $20/month {currentAccountType === 'Certified Dealer' && '(You currently have this account type)'}</Text>
              <Image source={goldCheckmark} style={styles.checkmark} />
            </View>
          </RadioButton.Group>
        </View>
        {type !== 'rider' && (
          <TouchableOpacity style={styles.upgradeButton} onPress={handleCreateSubscription}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        )}
        <View style={styles.paymentContainer}>
          {type !== 'rider' && (
            <>
              <Text style={styles.paymentLabel}>Enter your card details:</Text>
              <CardField
                postalCodeEnabled={true}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }}
                style={styles.cardField}
              />
              <View style={styles.cardIcons}>
                <Image source={visa} style={styles.cardIcon} />
                <Image source={mastercard} style={styles.cardIcon} />
                <Image source={amex} style={styles.cardIcon} />
                <Image source={discover} style={styles.cardIcon} />
              </View>
            </>
          )}
        </View>
        {message ? <Text>{message}</Text> : null}
        <TouchableOpacity onPress={() => navigation.navigate('RideScoutDisclaimer')}>
          <Text style={styles.disclaimerLink}>View Disclaimer and Guidelines</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
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
  paymentContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
  },
  paymentLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  cardIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  cardIcon: {
    width: 40,
    height: 25,
    resizeMode: 'contain',
  },
  disclaimerLink: {
    color: '#007BFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
});

export default UpgradeAccount;
