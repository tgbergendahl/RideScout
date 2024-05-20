// screens/Profile.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar} />
        <Text style={styles.username}>BackwardzCap33</Text>
        <Text style={styles.bio}>Just a guy looking for cool spots to take my bike.</Text>
      </View>
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
      <View style={styles.post}>
        <View style={styles.media} />
        <Text style={styles.text}>A picture of my ride</Text>
      </View>
      <View style={styles.post}>
        <Text style={styles.text}>I've got a question for Suzuki guys, I can't start my bike while it's in 1st gear...</Text>
        <Text style={styles.subText}>#suzuki #suzukimaintenance #newrider #nohelmetgang #boozysuzi #newuser</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 40,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    marginTop: 5,
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  media: {
    height: 150,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  subText: {
    marginTop: 5,
    fontSize: 14,
    color: 'gray',
  },
});

export default Profile;
