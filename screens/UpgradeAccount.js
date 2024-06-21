import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, Picker } from 'react-native';
import { WebView } from 'react-native-webview';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import logo from '../assets/Ride_scout_2.jpg'; // Ensure the correct path to your logo image

const UpgradeAccount = () => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [type, setType] = useState('certified');
  const [months, setMonths] = useState(1);
  const [showWebView, setShowWebView] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      Alert.alert('Error', 'No user is currently logged in.');
      return;
    }

    const userDocRef = doc(db, 'RideScout/Data/Users', user.uid);
    const updates = type === 'certified' ? { isCertifiedSeller: true } : { isSuperCertifiedSeller: true };
    const displayName = type === 'certified' ? 'CertifiedSeller' : 'SuperCertifiedSeller';

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
    setShowWebView(false);
    handleUpgrade();
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Upgrade Your Account</Text>
      <Text style={styles.description}>
        Upgrading your account to be a CertifiedSeller adds a blue check mark to your profile and means that you can sell up to seven (7) items on the marketplace at once, as opposed to three (3) at a time for normal users. Upgrading to a SuperCertifiedSeller comes with a bronze checkmark and allows you to list up to thirty (30) items on the marketplace at once, and is recommended for businesses. As a SuperCertifiedSeller shows that they are a valuable member of RideScout, the team will promote them to silver or gold.
      </Text>
      <View style={styles.selectionContainer}>
        <Text style={styles.label}>Select Upgrade Type:</Text>
        <Picker selectedValue={type} style={styles.picker} onValueChange={(itemValue) => setType(itemValue)}>
          <Picker.Item label="Certified Seller - $10/month" value="certified" />
          <Picker.Item label="Super Certified Seller - $30/month" value="super" />
        </Picker>
      </View>
      <View style={styles.selectionContainer}>
        <Text style={styles.label}>Select Number of Months:</Text>
        <Picker selectedValue={months} style={styles.picker} onValueChange={(itemValue) => setMonths(itemValue)}>
          {[...Array(36)].map((_, i) => (
            <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>
      </View>
      <Button title="Upgrade Now" onPress={() => setShowWebView(true)} color="#007BFF" />
      {showWebView && (
        <WebView
          source={{ uri: `http://localhost:3000/paypal?type=${type}&months=${months}` }}
          style={{ flex: 1 }}
          onNavigationStateChange={(event) => {
            if (event.url.includes('success')) {
              handlePaymentSuccess();
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  selectionContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default UpgradeAccount;
