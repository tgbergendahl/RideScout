import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Following = ({ route }) => {
  const { userId } = route.params;
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const userRef = doc(db, 'RideScout/Data/Users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setFollowing(userDoc.data().following || []);
        }
      } catch (error) {
        console.error('Error fetching following:', error);
      }
    };
    fetchFollowing();
  }, [userId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={following}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.followingItem}>
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
  followingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
});

export default Following;
