import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import Splash from './Components/Splash';
import Welcome from './Components/Welcome';
import OTP from './Components/OTP';
import VerificationPage from './Components/VerificationPage';
import Registration from './Components/Registration';
import Tour from './Components/Tour';
import Confirmation from './Components/Confirmation';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setInitialRoute('Registration'); 
        }
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setIsLoading(false); 
      }
    };
    checkToken();
  }, []);

  if (isLoading) {
   
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="OTP" component={OTP} />
        {/* <Stack.Screen name="Verification" component={VerificationPage} /> */}
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Tour" component={Tour} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
