import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TextInput, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import defaultProfile from '../assets/defaultProfile.png';
import { getUserBadge } from '../utils/getUserBadge'; // Import the getUserBadge function

const RiderDirectory = ({ navigation }) => {
  const [riders, setRiders] = useState([]);
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRiders = async () => {
    try {
      const ridersQuery = collection(db, 'RideScout/Data/Users');
      const querySnapshot = await getDocs(ridersQuery);
      const fetchedRiders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).filter(rider => rider.username); // Ensure that username exists
      console.log('Fetched Riders:', fetchedRiders); // Debugging log
      setRiders(fetchedRiders);
      fetchUserData(fetchedRiders);
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  const fetchUserData = async (riders) => {
    console.log("Fetching user data...");
    const userIds = [...new Set(riders.map(rider => rider.id).filter(userId => userId))];
    console.log("User IDs: ", userIds);

    const userPromises = userIds.map(userId => getDoc(doc(db, 'RideScout', 'Data', 'Users', userId)));
    const userDocs = await Promise.all(userPromises);

    const usersData = {};
    userDocs.forEach(userDoc => {
      if (userDoc.exists()) {
        usersData[userDoc.id] = userDoc.data();
      }
    });

    console.log("Fetched users data: ", usersData);
    setUsers(usersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRiders().then(() => setRefreshing(false));
  };

  const filteredRiders = riders.filter(rider =>
    rider.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search riders by username"
        value={search}
        onChangeText={setSearch}
      />
      {filteredRiders.length === 0 ? (
        <Text>No riders found.</Text>
      ) : (
        <FlatList
          data={filteredRiders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('RiderProfile', { userId: item.id })}>
              <View style={styles.riderItem}>
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Image
                    source={users[item.id]?.profileImage ? { uri: users[item.id].profileImage } : defaultProfile}
                    style={styles.profilePicture}
                    onError={() => console.log('Error loading profile picture for', item.username)}
                  />
                )}
                <View style={styles.usernameContainer}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Image source={getUserBadge(users[item.id])} style={styles.badgeImage} />
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 20,
  },
  riderItem: {
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
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badgeImage: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
});

export default RiderDirectory;
