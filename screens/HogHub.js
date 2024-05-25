import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getHogs } from '../api/hogs';
import logo from '../assets/Ride scout (2).jpg'; // Ensure the correct path to your logo image

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
      <Image source={logo} style={styles.logo} />
      <Button
        title="Create Hog"
        onPress={() => navigation.navigate('CreateHog')}
      />
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
    padding: 20,
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
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
  contactSeller: {
    color: 'blue',
    marginTop: 10,
  },
});

export default HogHub;
