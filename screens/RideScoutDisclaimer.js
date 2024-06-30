import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const RideScoutDisclaimer = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RideScout LLC Disclaimer and Guidelines</Text>
      <Text style={styles.sectionTitle}>Disclaimer:</Text>
      <Text style={styles.text}>
        RideScout LLC is committed to providing a seamless and enjoyable experience for all users. Should you encounter any issues with your purchases or services, please follow the guidelines below:
      </Text>
      <Text style={styles.sectionTitle}>Purchases:</Text>
      <Text style={styles.text}>
        If you make a purchase to upgrade your account and do not see a confirmation check mark on your profile, please refresh your profile page.
        If the issue persists, contact us at thomas@ridescout.net for assistance. Although this issue is rare, we are here to help resolve it promptly.
      </Text>
      <Text style={styles.sectionTitle}>Refunds:</Text>
      <Text style={styles.text}>
        If you pay for services from RideScout LLC and do not receive them, you will be eligible for a refund.
        If you change your mind after purchasing a service, refunds will not be provided. We recommend starting with a one-month subscription before committing to a longer-term plan.
      </Text>
      <Text style={styles.sectionTitle}>Prohibited Items:</Text>
      <Text style={styles.text}>
        RideScout LLC strictly prohibits the sale of illicit materials such as drugs, alcohol, pornography, weapons, and any other items that violate our guidelines.
        The primary focus of HogHub is the sale of motorcycles, motorcycle-related accessories, merchandise, and other types of vehicles, parts, and accessories.
      </Text>
      <Text style={styles.sectionTitle}>Guidelines:</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Respectful Conduct:</Text> All users must engage in respectful and courteous behavior. Harassment, hate speech, and abusive language will not be tolerated.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Legal Compliance:</Text> Users must comply with all local, state, and federal laws. The sale of illegal or restricted items is strictly prohibited.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Accurate Listings:</Text> Ensure that all listings are accurate and truthful. Misleading or false information is not permitted.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Intellectual Property:</Text> Respect the intellectual property rights of others. Do not post or sell counterfeit or unauthorized items.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Prohibited Content:</Text> Do not post any content that is obscene, offensive, or inappropriate. This includes, but is not limited to, drugs, pornography, weapons, and other prohibited items.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Account Security:</Text> Safeguard your account information and do not share your login credentials with others. Report any suspicious activity immediately.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Transactions:</Text> Conduct all transactions that involve RideScout (E.g. merchandise purchases and account upgrades) through the RideScout platform. Avoid off-platform transactions to ensure security.
      </Text>
      <Text style={styles.text}>
        RideScout understands that transactions on HogHub will largely take place off-platform, including but not limited to cash deals where users meet up, digital money transfers, and checks. Exercise caution when contacting people you do not know, one of the main benefits of RideScout is that you can view the other person’s profile - if it seems suspicious, treat it as such and avoid the transaction.
      </Text>
      <Text style={styles.text}>
        When making an in-person transaction with another user, inform someone you know that you are doing so. RideScout recommends meeting in a public place.
      </Text>
      <Text style={styles.text}>
        When purchasing a product that is not from the RideScout store, we cannot guarantee that it will be exactly as advertised. If you make a purchase and it is faulty, you can contact jared@ridescout.net and we can investigate the account. However, we will not be able to insure or refund your purchases made on our marketplace from other users.
      </Text>
      <Text style={styles.text}>
        By adhering to these guidelines, we can maintain a safe and thriving community for all RideScout users. Thank you for your cooperation and support.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default RideScoutDisclaimer;
