import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import defaultProfile from '../assets/defaultProfile.png';

const Following = ({ route, navigation }) => {
  const { userId } = route.params;
  const [following, setFollowing] = useState([]);
  const [users, setUsers] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      console.log('Fetching following for user:', userId);
      const userRef = doc(db, 'RideScout', 'Data', 'Users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const followingArray = userDoc.data().followingArray || [];
        console.log('Following array:', followingArray);
        const validFollowingArray = followingArray.filter(id => id); // Filter out any empty strings
        setFollowing(validFollowingArray);
        await fetchUserData(validFollowingArray);
      } else {
        console.log('No such document!');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
      setLoading(false);
    }
  };

  const fetchUserData = async (userIds) => {
    try {
      console.log('Fetching user data for IDs:', userIds);
      const userPromises = userIds.map(id => getDoc(doc(db, 'RideScout', 'Data', 'Users', id)));
      const userDocs = await Promise.all(userPromises);

      const usersData = {};
      userDocs.forEach(userDoc => {
        if (userDoc.exists()) {
          usersData[userDoc.id] = userDoc.data();
        }
      });

      console.log('Fetched user data:', usersData);
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFollowing().then(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RiderProfile', { userId: item })}>
      <View style={styles.followingItem}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Image
            source={users[item]?.profileImage ? { uri: users[item].profileImage } : defaultProfile}
            style={styles.profilePicture}
            onError={() => console.log('Error loading profile picture for', users[item]?.username || 'Unknown User')}
          />
        )}
        <Text>{users[item]?.username || 'Unknown User'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={following}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  followingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default Following;
