import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './Components/Splash';
import Welcome from './Components/Welcome';
import OTP from './Components/OTP';
import Registration from './Components/Registration';
import Tour from './Components/Tour';
import Confirmation from './Components/Confirmation';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Tour" component={Tour} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
