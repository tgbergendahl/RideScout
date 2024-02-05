import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

function Profile() {
  // Placeholder for user data - you might fetch this from your backend in a real app
  const userData = {
    name: 'Rider John',
    bio: 'Motorcycle enthusiast | Adventure seeker | Sharing my rides',
    profilePic: 'https://via.placeholder.com/150', // Placeholder image URL
    postsCount: 27,
    followersCount: 134,
    followingCount: 211,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.bio}>{userData.bio}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>
      {/* Placeholder for user's posts or activities */}
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {/* Placeholder elements for posts - replace with actual data */}
        <View style={styles.postPlaceholder}></View>
        <View style={styles.postPlaceholder}></View>
        <View style={styles.postPlaceholder}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue',
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  postsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 10,
  },
  postPlaceholder: {
    height: 200,
    backgroundColor: 'lightblue',
    marginBottom: 15,
    borderRadius: 8,
  },
  // Add more styles as needed
});

export default Profile;
