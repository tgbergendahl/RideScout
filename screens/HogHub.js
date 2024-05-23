import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

const HogHub = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsQuery = query(collection(db, 'RideScout/Data/Hogs'), orderBy('createdAt', 'desc'));
      const listingsSnapshot = await getDocs(listingsQuery);
      const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(listingsData);
    };
    fetchListings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.listing}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <FlatList
        data={item.imageUrls}
        horizontal
        renderItem={({ item: imageUrl }) => <Image source={{ uri: imageUrl }} style={styles.image} />}
        keyExtractor={(imageUrl, index) => index.toString()}
      />
      <TouchableOpacity onPress={() => navigation.navigate('ContactSeller', { listingId: item.id })}>
        <Text style={styles.contactLink}>Contact Seller</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {listings.length > 0 ? (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noListings}>No listings available at the moment. Check back later!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listing: {
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
  category: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  contactLink: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  noListings: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default HogHub;
