// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/Profile';
import HogHubScreen from './screens/HogHub';
import FeaturedRidesScreen from './screens/FeaturedRides';
import ScenicSpotsScreen from './screens/ScenicSpots';
import ChallengesPageScreen from './screens/ChallengesPage';
import CreatePostScreen from './screens/CreatePost';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Tab.Screen name="HogHubTab" component={HogHubScreen} options={{ title: 'Hog Hub' }} />
        <Tab.Screen name="FeaturedRidesTab" component={FeaturedRidesScreen} options={{ title: 'Featured Rides' }} />
        <Tab.Screen name="ScenicSpotsTab" component={ScenicSpotsScreen} options={{ title: 'Scenic Spots' }} />
        <Tab.Screen name="ChallengesTab" component={ChallengesPageScreen} options={{ title: 'Challenges' }} />
        <Tab.Screen name="CreatePostTab" component={CreatePostScreen} options={{ title: 'Create Post' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
