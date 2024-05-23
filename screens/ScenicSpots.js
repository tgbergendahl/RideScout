import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

const ScenicSpots = ({ navigation }) => {
  const [spots, setSpots] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchSpots = async () => {
      const spotsQuery = query(collection(db, 'RideScout/Data/ScenicSpots'), orderBy('createdAt', 'desc'));
      const spotsSnapshot = await getDocs(spotsQuery);
      const spotsData = spotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpots(spotsData);
    };

    const checkAdmin = () => {
      const user = auth.currentUser;
      if (user && user.email === 'jared@ridescout.net') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    fetchSpots();
    checkAdmin();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.spot}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
      <Text>Likes: {item.likes}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Comments', { spotId: item.id })}>
        <Text style={styles.commentsLink}>View Comments</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isAdmin && <Button title="Add Scenic Spot" onPress={() => navigation.navigate('CreateScenicSpot')} />}
      {spots.length > 0 ? (
        <FlatList
          data={spots}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noSpots}>No scenic spots available at the moment. Check back later!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  spot: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    fontSize: 16,
  },
  image: {
    marginTop: 10,
    height: 200,
    width: '100%',
    borderRadius: 10,
  },
  commentsLink: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  noSpots: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ScenicSpots;
