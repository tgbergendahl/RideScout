// screens/ChallengesPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChallengesPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No challenges are posted just yet, keep an eye out</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'gray',
  },
});

export default ChallengesPage;
