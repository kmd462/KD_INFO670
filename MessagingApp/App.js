import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SenderScreen from './screens/SenderScreen';      
import ReceiverScreen from './screens/ReceiverScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Sender"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Sender" 
            component={SenderScreen}    // ← Not a string, actual component
            options={{ title: 'Send Message' }}
          />
          <Stack.Screen 
            name="Receiver" 
            component={ReceiverScreen}  // ← Not a string, actual component
            options={{ title: 'Receive Messages' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}