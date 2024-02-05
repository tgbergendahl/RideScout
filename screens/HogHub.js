import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

function HogHub() {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for listings - In a real app, this would come from your app's backend
  const listings = [
    { id: 1, title: 'Classic Cruiser', seller: 'John Doe', verified: true },
    { id: 2, title: 'Speedy Sportbike', seller: 'Jane Smith', verified: false },
    { id: 3, title: 'Reliable Moped', seller: 'Bob Brown', verified: true },
    // Add more listings here
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Implement search functionality here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HogHub Marketplace</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search vehicles..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView>
        {listings.map((listing) => (
          <View key={listing.id} style={[styles.listing, listing.verified ? styles.verifiedListing : null]}>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <Text style={styles.listingSeller}>{listing.seller}</Text>
            {listing.verified && <Text style={styles.verifiedLabel}>Verified Seller</Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
    marginVertical: 10,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    margin: 10,
    fontSize: 16,
  },
  listing: {
    backgroundColor: 'lightblue',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  verifiedListing: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  listingSeller: {
    fontSize: 14,
    color: '#fff',
  },
  verifiedLabel: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'blue',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  // Add more styles as needed
});

export default HogHub;
