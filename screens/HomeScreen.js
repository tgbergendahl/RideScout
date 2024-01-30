import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your custom components for each tab
// import FeaturedRides from './screens/FeaturedRides';
// import MapScreen from './screens/MapScreen';
// import HogHub from './screens/HogHub';
// import Profile from './screens/Profile';

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home!</Text>
    </View>
  );
}

function RideScoutApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: 'white' },
        }}
      >
        <Tab.Screen name="Featured Rides" component={HomeScreen} /* Replace HomeScreen with your FeaturedRides component */ />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={HomeScreen} /* Replace HomeScreen with your MapScreen component */ />
        <Tab.Screen name="HogHub" component={HomeScreen} /* Replace HomeScreen with your HogHub component */ />
        <Tab.Screen name="Profile" component={HomeScreen} /* Replace HomeScreen with your Profile component */ />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  // Add more styles as needed
});

export default RideScoutApp;
