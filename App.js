import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import FeaturedRides from './screens/FeaturedRides';
import HogHub from './screens/HogHub';
import Home from './screens/HomeScreen';
import Profile from './screens/Profile';
import ScenicSpots from './screens/ScenicSpots';
import ChallengesPage from './screens/ChallengesPage';
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignupPage';
import CreatePost from './screens/CreatePost';
import CreateHog from './screens/CreateHog';
import Header from './components/Header'; // Import the Header component

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

// Create a stack navigator for additional screens
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarStyle: { backgroundColor: 'white' }, // Tab bar style
      }}
    >
      <Tab.Screen name="Featured Rides" component={FeaturedRidesStack} />
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Scenic Spots" component={ScenicSpotsStack} />
      <Tab.Screen name="HogHub" component={HogHubStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

function FeaturedRidesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
    >
      <Stack.Screen name="FeaturedRides" component={FeaturedRides} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CreatePost" component={CreatePost} />
    </Stack.Navigator>
  );
}

function ScenicSpotsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
    >
      <Stack.Screen name="ScenicSpots" component={ScenicSpots} />
    </Stack.Navigator>
  );
}

function HogHubStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
    >
      <Stack.Screen name="HogHub" component={HogHub} />
      <Stack.Screen name="CreateHog" component={CreateHog} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChallengesPage" component={ChallengesPage} />
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="SignupPage" component={SignupPage} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainTabs />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
