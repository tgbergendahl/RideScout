import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens
import FeaturedRides from './screens/FeaturedRides';
import HogHub from './screens/HogHub';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import Profile from './screens/Profile';

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'blue', // Active tab color
          tabBarInactiveTintColor: 'gray', // Inactive tab color
          tabBarStyle: { backgroundColor: 'white' }, // Tab bar style
        }}
      >
        <Tab.Screen name="Featured Rides" component={FeaturedRides} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="HogHub" component={HogHub} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

// You can keep your existing styles or modify them as needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
