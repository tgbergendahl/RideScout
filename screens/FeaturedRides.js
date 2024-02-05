import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

function FeaturedRides() {
  // Sample content for the page
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Featured Rides</Text>
      {/* Placeholder for featured rides content */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ride Through the Rockies</Text>
        <Text style={styles.cardContent}>
          Explore the breathtaking views of the Rocky Mountains on this curated ride.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Coastal Cruise</Text>
        <Text style={styles.cardContent}>
          Feel the ocean breeze as you cruise along the coast.
        </Text>
      </View>
      {/* Add more cards for other featured rides */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue',
    margin: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'lightblue',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContent: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  // Add more styles as needed
});

export default FeaturedRides;
