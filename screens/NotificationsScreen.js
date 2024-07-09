import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import defaultProfile from '../assets/defaultProfile.png';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});
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
        where('recipientId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(notificationsQuery);
      const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Manually sort notifications by timestamp in descending order
      notificationsData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

      setNotifications(notificationsData);
      fetchUserData(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const fetchUserData = async (notifications) => {
    const userIds = [...new Set(notifications.map(notification => notification.senderId).filter(userId => userId))];
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

    // Update notifications to include the username in the message
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      message: `${usersData[notification.senderId]?.username} ${notification.message.split(' ').slice(1).join(' ')}`
    }));

    setNotifications(updatedNotifications);
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
      <Image
        source={users[item.senderId]?.profileImage ? { uri: users[item.senderId].profileImage } : defaultProfile}
        style={styles.profilePicture}
      />
      <View style={styles.notificationText}>
        <Text>{item.message}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default NotificationsScreen;
