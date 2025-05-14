import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import GalleryScreen from './screens/GalleryScreen';
import ViewerScreen from './screens/ViewerScreen';
import ProfileScreen from './screens/ProfileScreen';

// Only declare Tab once
const Tab = createBottomTabNavigator();

// Only export App once
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Gallery') {
              iconName = 'images-outline';
            } else if (route.name === 'Viewer') {
              iconName = 'image-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Gallery" component={GalleryScreen} />
        <Tab.Screen name="Viewer" component={ViewerScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}