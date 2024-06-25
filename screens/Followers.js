import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Followers = ({ route }) => {
  const { userId } = route.params;
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const userRef = doc(db, 'RideScout/Data/Users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setFollowers(userDoc.data().followers || []);
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };
    fetchFollowers();
  }, [userId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.followerItem}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  followerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
});

export default Followers;
