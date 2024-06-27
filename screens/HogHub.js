import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, Button, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getHogs } from '../api/hogs';
import logo from '../assets/RideScout.jpg';

const HogHub = () => {
  const [hogs, setHogs] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHogs();
      setHogs(data);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Button
        title="Create Hog"
        onPress={() => navigation.navigate('CreateHog')}
      />
      <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('RideScoutStore')}>
        <Icon name="shopping-cart" size={20} color="#fff" />
        <Text style={styles.shopButtonText}>Shop RideScout</Text>
      </TouchableOpacity>
      <FlatList
        data={hogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.hogItem}>
            <Text>Category: {item.category}</Text>
            <Text>Price: ${item.price}</Text>
            {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
            <TouchableOpacity onPress={() => navigation.navigate('ContactSeller', { hogId: item.id })}>
              <Text style={styles.contactSeller}>Contact Seller</Text>
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
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  shopButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
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
  contactSeller: {
    color: 'blue',
    marginTop: 10,
  },
});

export default HogHub;
