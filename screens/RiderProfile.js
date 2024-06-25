import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, ToastAndroid } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

const RiderProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const { currentUser } = useAuth();
  const [rider, setRider] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchRider = async () => {
      const riderDoc = await getDoc(doc(db, 'RideScout/Data/Users', userId));
      if (riderDoc.exists) {
        setRider({ id: riderDoc.id, ...riderDoc.data() });
        setIsFollowing(riderDoc.data().followers?.includes(currentUser.uid) || false);
      }
    };

    fetchRider();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    const riderRef = doc(db, 'RideScout/Data/Users', userId);
    const userRef = doc(db, 'RideScout/Data/Users', currentUser.uid);

    if (isFollowing) {
      await updateDoc(riderRef, {
        followers: arrayRemove(currentUser.uid),
      });
      await updateDoc(userRef, {
        following: arrayRemove(userId),
      });
    } else {
      await updateDoc(riderRef, {
        followers: arrayUnion(currentUser.uid),
      });
      await updateDoc(userRef, {
        following: arrayUnion(userId),
      });
      ToastAndroid.show('Account followed successfully', ToastAndroid.SHORT);
    }

    setIsFollowing(!isFollowing);
  };

  if (!rider) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={rider.profilePicture ? { uri: rider.profilePicture } : require('../assets/defaultProfile.png')}
        style={styles.profilePicture}
      />
      <Text style={styles.username}>{rider.username}</Text>
      <Text style={styles.bio}>{rider.bio}</Text>
      <Button title={isFollowing ? 'Unfollow' : 'Follow'} onPress={handleFollow} />
      <Button title="Message" onPress={() => navigation.navigate('Inbox', { recipientId: rider.id })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default RiderProfile;
