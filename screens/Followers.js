import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import defaultProfile from '../assets/defaultProfile.png';

const Followers = ({ route, navigation }) => {
  const { userId } = route.params;
  const [followers, setFollowers] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  const fetchFollowers = async () => {
    try {
      const userRef = doc(db, 'RideScout', 'Data', 'Users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const followersArray = userDoc.data().followersArray || [];
        const validFollowersArray = followersArray.filter(id => id); // Filter out any empty strings
        setFollowers(validFollowersArray);
        await fetchUserData(validFollowersArray);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      setLoading(false);
    }
  };

  const fetchUserData = async (userIds) => {
    try {
      const userPromises = userIds.map(id => getDoc(doc(db, 'RideScout', 'Data', 'Users', id)));
      const userDocs = await Promise.all(userPromises);

      const usersData = {};
      userDocs.forEach(userDoc => {
        if (userDoc.exists()) {
          usersData[userDoc.id] = userDoc.data();
        }
      });

      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFollowers().then(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RiderProfile', { userId: item })}>
      <View style={styles.followerItem}>
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
          data={followers}
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
  followerItem: {
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

export default Followers;
