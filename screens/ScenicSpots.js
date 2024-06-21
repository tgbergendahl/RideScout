// screens/ScenicSpots.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getScenicSpots } from '../api/scenicSpots';
import logo from '../assets/RideScout.jpg'; // Ensure the correct path to your logo image

const ScenicSpots = () => {
  const [scenicSpots, setScenicSpots] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getScenicSpots();
      setScenicSpots(data);
    };

    fetchData();
  }, []);

  const renderScenicSpot = ({ item }) => (
    <View style={styles.spotContainer}>
      <Text>{item.description}</Text>
      <Text>{item.location}</Text>
      {item.imageUrls && item.imageUrls.map((url, index) => (
        <Image key={index} source={{ uri: url }} style={styles.image} />
      ))}
      {item.videoUrl && <Video source={{ uri: item.videoUrl }} style={styles.video} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Button
        title="Create Scenic Spot"
        onPress={() => navigation.navigate('CreateScenicSpot')}
      />
      <FlatList
        data={scenicSpots}
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
    width: 100,
    height: 50,
    alignSelf: 'center',
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
