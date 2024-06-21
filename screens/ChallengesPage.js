// screens/ChallengesPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

const ChallengesPage = ({ navigation }) => {
  const [challenges, setChallenges] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchChallenges = async () => {
      const challengesQuery = query(collection(db, 'RideScout/Data/Challenges'), orderBy('createdAt', 'desc'));
      const challengesSnapshot = await getDocs(challengesQuery);
      const challengesData = challengesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChallenges(challengesData);
    };

    fetchChallenges();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.challenge}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Button title="View Challenge" onPress={() => navigation.navigate('ChallengeDetail', { challengeId: item.id })} />
    </View>
  );

  return (
    <View style={styles.container}>
      {challenges.length > 0 ? (
        <FlatList
          data={challenges}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noChallenges}>No challenges available at the moment. Check back later!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  challenge: {
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
  noChallenges: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ChallengesPage;
