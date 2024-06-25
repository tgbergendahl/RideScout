import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const RiderDirectory = ({ navigation }) => {
  const [riders, setRiders] = useState([]);
  const [search, setSearch] = useState('');

  const fetchRiders = async () => {
    const ridersQuery = collection(db, 'RideScout/Data/Users');
    const querySnapshot = await getDocs(ridersQuery);
    const fetchedRiders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })).filter(rider => rider.username); // Ensure that username exists
    setRiders(fetchedRiders);
  };

  useEffect(() => {
    fetchRiders();
  }, []);

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
                <Image
                  source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/defaultProfile.png')}
                  style={styles.profilePicture}
                />
                <Text>{item.username}</Text>
              </View>
            </TouchableOpacity>
          )}
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
});

export default RiderDirectory;
