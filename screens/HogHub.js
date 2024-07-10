import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, Text, TextInput, Alert, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { collection, query, getDocs, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import logo from '../assets/RideScout.jpg';
import defaultProfile from '../assets/defaultProfile.png';
import ModalDropdown from 'react-native-modal-dropdown';

const HogHub = () => {
  const [hogs, setHogs] = useState([]);
  const [users, setUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHogs, setFilteredHogs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    fetchHogs();
  }, []);

  const fetchHogs = async () => {
    try {
      const q = query(collection(db, 'hogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedHogs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHogs(fetchedHogs);
      fetchUserData(fetchedHogs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hogs:', error);
      Alert.alert('Error', 'There was an issue fetching the listings.');
      setLoading(false);
    }
  };

  const fetchUserData = async (posts) => {
    const userIds = [...new Set(posts.map(post => post.userId).filter(userId => userId))];

    const userPromises = userIds.map(userId => getDoc(doc(db, 'RideScout/Data/Users', userId)));
    const userDocs = await Promise.all(userPromises);

    const usersData = {};
    userDocs.forEach(userDoc => {
      if (userDoc.exists()) {
        usersData[userDoc.id] = userDoc.data();
      }
    });

    setUsers(usersData);
    setLoading(false);
  };

  useEffect(() => {
    const filtered = hogs.filter(hog =>
      (hog.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (hog.make?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (hog.model?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (hog.location?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ).filter(hog =>
      (category ? hog.category === category : true) &&
      (subcategory ? hog.subcategory === subcategory : true)
    );
    setFilteredHogs(filtered);
  }, [searchQuery, hogs, category, subcategory]);

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const handleDeleteHog = async (hogId) => {
    try {
      await deleteDoc(doc(db, 'hogs', hogId));
      Alert.alert('Deleted', 'Your listing has been deleted.');
      fetchHogs();
    } catch (error) {
      console.error('Error deleting hog:', error);
      Alert.alert('Error', 'There was an issue deleting your listing. Please try again.');
    }
  };

  const promptDeleteHog = (hogId) => {
    Alert.alert(
      'Why are you deleting the listing?',
      null,
      [
        { text: 'Item has been sold', onPress: () => handleDeleteHog(hogId) },
        { text: 'No longer interested in selling', onPress: () => handleDeleteHog(hogId) },
        { text: 'Not listed correctly', onPress: () => handleDeleteHog(hogId) },
        { text: 'Just because', onPress: () => handleDeleteHog(hogId) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHogs().then(() => setRefreshing(false));
  };

  const renderHogItem = ({ item }) => (
    <View style={styles.hogItem}>
      <TouchableOpacity onPress={() => navigation.navigate('RiderProfile', { userId: item.userId })}>
        <Image
          source={users[item.userId]?.profileImage ? { uri: users[item.userId].profileImage } : defaultProfile}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{users[item.userId]?.username || 'Unknown User'}</Text>
      </TouchableOpacity>
      <Text>Category: {item.category}</Text>
      <Text>Subcategory: {item.subcategory}</Text>
      <Text>Description: {item.description}</Text>
      <Text>Make: {item.make}</Text>
      <Text>Model: {item.model}</Text>
      <Text>Color: {item.color}</Text>
      <Text>Price: ${item.price}</Text>
      <Text>Location: {item.location}</Text>
      <Text>Phone: {item.phone}</Text>
      <View style={styles.imageGrid}>
        {item.imageUrls && item.imageUrls.map((url, index) => (
          <TouchableOpacity key={index} onPress={() => handleImagePress(url)}>
            <Image source={{ uri: url }} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </View>
      <Text>Posted on: {item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}</Text>
      <TouchableOpacity style={styles.messageButton} onPress={() => navigation.navigate('Inbox', { recipientId: item.userId })}>
        <Text style={styles.messageButtonText}>Message</Text>
      </TouchableOpacity>
      {item.userId === auth.currentUser?.uid && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => promptDeleteHog(item.id)}>
          <Text style={styles.deleteButtonText}>Delete Listing</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
          <Icon name="shopping-cart" size={20} color="#000" />
          <Text style={styles.buttonText}>Shop RideScout</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search listings"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filterContainer}>
        <ModalDropdown
          options={['All Categories', 'Vehicle', 'Gear', 'Accessory']}
          defaultValue="All Categories"
          onSelect={(index, value) => setCategory(value === 'All Categories' ? '' : value)}
          style={[styles.dropdown, { backgroundColor: '#ccc' }]}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownMenu}
        />
        <ModalDropdown
          options={['All Subcategories', 'Motorcycle', 'Helmet', 'Jacket', 'Gloves']}
          defaultValue="All Subcategories"
          onSelect={(index, value) => setSubcategory(value === 'All Subcategories' ? '' : value)}
          style={[styles.dropdown, { backgroundColor: '#ccc' }]}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownMenu}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={filteredHogs}
          keyExtractor={item => item.id}
          renderItem={renderHogItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
            <Icon name="times-circle" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '45%',
  },
  dropdownText: {
    fontSize: 14,
    color: '#00',
  },
  dropdownMenu: {
    borderRadius: 5,
    marginTop: 2,
  },
  hogItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  messageButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  messageButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default HogHub;
