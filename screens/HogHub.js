import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import logo from '../assets/RideScout.jpg';

const HogHub = () => {
  const [hogs, setHogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHogs, setFilteredHogs] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'RideScout/Data/hogs'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const hogsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setHogs(hogsData);
          setFilteredHogs(hogsData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching hogs:', error);
        Alert.alert('Error', 'There was an issue fetching the listings.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = hogs.filter(hog =>
      (hog.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (hog.make?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (hog.model?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (hog.location?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    setFilteredHogs(filtered);
  }, [searchQuery, hogs]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateHog')}>
          <Text style={styles.buttonText}>Create Hog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RideScoutStore')}>
          <Icon name="shopping-cart" size={20} color="#fff" />
          <Text style={styles.buttonText}>Shop RideScout</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search listings"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredHogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.hogItem}>
            <Text>Category: {item.category}</Text>
            <Text>Price: ${item.price}</Text>
            {item.imageUrls && item.imageUrls.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.image} />
            ))}
            <Text>Posted by: {item.username}</Text>
            <TouchableOpacity style={styles.messageButton} onPress={() => navigation.navigate('Inbox', { userId: item.userId })}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  hogItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  messageButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#fff',
  },
});

export default HogHub;
