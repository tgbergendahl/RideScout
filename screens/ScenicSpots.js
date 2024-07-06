import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, RefreshControl, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';  // Make sure you have this installed
import { db, auth } from '../firebaseConfig';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

const ScenicSpots = () => {
  const [scenicSpots, setScenicSpots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  const fetchData = async () => {
    const q = query(collection(db, 'scenicSpots'), orderBy('createdAt', 'desc'));
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = scenicSpots.filter(spot =>
      (spot.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (spot.location?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (spot.address?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    setFilteredSpots(filtered);
  }, [searchQuery, scenicSpots]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  const handleLike = async (spotId) => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to like a scenic spot');
      return;
    }

    const spotRef = doc(db, 'scenicSpots', spotId);
    await updateDoc(spotRef, {
      likesCount: increment(1),
      likesArray: arrayUnion(currentUser.uid)
    });
  };

  const renderScenicSpot = ({ item }) => (
    <View style={styles.spotContainer}>
      <Text style={styles.spotName}>{item.name}</Text>
      <Text style={styles.spotDescription}>{item.description}</Text>
      <Text style={styles.spotLocation}>{item.location}</Text>
      <Text style={styles.spotAddress}>{item.address}</Text>
      {item.imageUrls && item.imageUrls.map((url, index) => (
        <Image key={index} source={{ uri: url }} style={styles.image} />
      ))}
      <Text style={styles.spotContact}>Contact: {item.contact}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.website)}>
        <Text style={styles.spotWebsite}>Website</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
          <Icon name="thumbs-up" size={20} color="#000" />
          <Text>{item.likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', { spotId: item.id })} style={styles.actionButton}>
          <Icon name="comment" size={20} color="#000" />
          <Text>{item.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name, location, or address"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity
        style={styles.submitSpotButton}
        onPress={() => navigation.navigate('CreateScenicSpot')}
      >
        <Text style={styles.submitSpotButtonText}>Submit a Scenic Spot</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredSpots}
        keyExtractor={(item) => item.id}
        renderItem={renderScenicSpot}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
  submitSpotButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitSpotButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spotContainer: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spotDescription: {
    fontSize: 16,
  },
  spotLocation: {
    fontSize: 14,
    color: '#666',
  },
  spotAddress: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  spotContact: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  spotWebsite: {
    fontSize: 14,
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ScenicSpots;
