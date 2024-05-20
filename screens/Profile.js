// screens/Profile.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button
        title="Challenges"
        onPress={() => navigation.navigate('ChallengesPage')}
      />
      <Button
        title="Login"
        onPress={() => navigation.navigate('LoginPage')}
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignupPage')}
      />
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

export default Profile;
