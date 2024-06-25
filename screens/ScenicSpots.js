import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

const ScenicSpots = () => {
  const [scenicSpots, setScenicSpots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpots, setFilteredSpots] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'scenicSpots'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const spotsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setScenicSpots(spotsData);
        setFilteredSpots(spotsData);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = scenicSpots.filter(spot =>
      spot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSpots(filtered);
  }, [searchQuery, scenicSpots]);

  const renderScenicSpot = ({ item }) => (
    <View style={styles.spotContainer}>
      <Text style={styles.spotDescription}>{item.description}</Text>
      <Text style={styles.spotLocation}>{item.location}</Text>
      {item.imageUrls && item.imageUrls.map((url, index) => (
        <Image key={index} source={{ uri: url }} style={styles.image} />
      ))}
      {item.videoUrl && <Video source={{ uri: item.videoUrl }} style={styles.video} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or location"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button
        title="Create Scenic Spot"
        onPress={() => navigation.navigate('CreateScenicSpot')}
      />
      <FlatList
        data={filteredSpots}
        keyExtractor={(item) => item.id}
        renderItem={renderScenicSpot}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  spotContainer: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  spotDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  spotLocation: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  video: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
});

export default ScenicSpots;
