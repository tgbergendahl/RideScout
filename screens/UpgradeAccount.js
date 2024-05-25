import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const UpgradeAccount = () => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const handleUpgrade = async (type) => {
    if (user) {
      const userDocRef = doc(db, 'RideScout/Data/Users', user.uid);
      const updates = type === 'certified' ? { isCertifiedSeller: true } : { isSuperCertifiedSeller: true };

      await updateDoc(userDocRef, updates);
      await updateProfile(user, {
        displayName: type === 'certified' ? 'CertifiedSeller' : 'SuperCertifiedSeller',
      });

      alert(`Upgraded to ${type === 'certified' ? 'Certified Seller' : 'Super Certified Seller'}!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade Your Account</Text>
      <Button title="Become a Certified Seller ($10/month)" onPress={() => handleUpgrade('certified')} />
      <Button title="Become a Super Certified Seller ($150/year)" onPress={() => handleUpgrade('super')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default UpgradeAccount;
