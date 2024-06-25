import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import ErrorBoundary from './components/ErrorBoundary'; // Custom error boundary component

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/Profile';
import HogHubScreen from './screens/HogHub';
import FeaturedRidesScreen from './screens/FeaturedRides';
import ScenicSpotsScreen from './screens/ScenicSpots';
import ChallengesPageScreen from './screens/ChallengesPage';
import CreatePostScreen from './screens/CreatePost';
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignupPage';
import UpgradeAccount from './screens/UpgradeAccount';
import ContactSellerScreen from './screens/ContactSeller';
import CreateScenicSpotScreen from './screens/CreateScenicSpot';
import CreateHogScreen from './screens/CreateHog';
import EditProfileScreen from './screens/EditProfile';
import CommentsScreen from './screens/Comments';
import FollowersScreen from './screens/Followers';
import FollowingScreen from './screens/Following';
import RiderDirectory from './screens/RiderDirectory';
import RiderProfile from './screens/RiderProfile';
import Inbox from './screens/Inbox';
import NotificationsScreen from './screens/NotificationsScreen'; // Import NotificationsScreen

import { AuthProvider } from './contexts/AuthContext';
import './firebaseConfig';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="FeaturedRides"
        component={FeaturedRidesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="star" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="ScenicSpots"
        component={ScenicSpotsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="map-marker" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="HogHub"
        component={HogHubScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="motorcycle" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="user" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginPage">
            <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="SignupPage" component={SignupPage} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ChallengesPage" component={ChallengesPageScreen} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="UpgradeAccount" component={UpgradeAccount} />
            <Stack.Screen name="ContactSeller" component={ContactSellerScreen} />
            <Stack.Screen name="CreateScenicSpot" component={CreateScenicSpotScreen} />
            <Stack.Screen name="CreateHog" component={CreateHogScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
            <Stack.Screen name="Followers" component={FollowersScreen} />
            <Stack.Screen name="Following" component={FollowingScreen} />
            <Stack.Screen name="RiderDirectory" component={RiderDirectory} />
            <Stack.Screen name="RiderProfile" component={RiderProfile} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} /> {/* Add NotificationsScreen */}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}
