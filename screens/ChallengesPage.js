// screens/ChallengesPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChallengesPage = () => {
  return (
    <View style={styles.container}>
      <Text>Challenges Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChallengesPage;
