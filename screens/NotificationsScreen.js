import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const notificationsQuery = query(
        collection(db, 'RideScout/Data/Notifications'),
        where('recipientId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(notificationsQuery);
      const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const handleNotificationPress = (notification) => {
    switch (notification.type) {
      case 'like':
      case 'comment':
        navigation.navigate('Comments', { postId: notification.postId });
        break;
      case 'message':
        navigation.navigate('Inbox', { userId: notification.senderId });
        break;
      case 'follow':
        navigation.navigate('RiderProfile', { userId: notification.senderId });
        break;
      default:
        break;
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)} style={styles.notification}>
      <Text>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  notification: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default NotificationsScreen;
