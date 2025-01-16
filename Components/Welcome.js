import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import CheckBox from '@react-native-community/checkbox';
import CustomCheckbox from './CustomCheckBox';
import { BASE_URL } from "@env";
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jestConfig from '../jest.config';
import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');



export default function Welcome() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('guide');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("this is token ", token)
    };
    checkToken();
  }, []);

  const handleSignUp = async () => {
    try {
      const response = await fetch(`https://correctedservice-production.up.railway.app/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType, phone }),
      });

      const result = await response.json();
      if (response.ok) {
        navigation.navigate('OTP', { email, userType, action: 'signup', phone });
      } else {
        alert(result.message || 'Signup failed.');
      }
    } catch (error) {
      alert('An error occurred during signup.');
    }
  };
  console.log('Rendering... isSignIn:', isSignIn);

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://correctedservice-production.up.railway.app/api/auth/login-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType }),
      });

      const result = await response.json();
      if (response.ok) {
        navigation.navigate('OTP', { email, userType, action: 'login' });
      } else if (result.message === 'User not found') {
        alert('User not registered. Please sign up first.');
      } else {
        alert(result.message || 'Login failed.');
      }
    } catch (error) {
      alert('An error occurred during login.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.heading}>Welcome</Text>
          <Text style={styles.subheading}>{isLoggedIn ? 'Login to your account' : 'Create an account'}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.textbox}>
              <Icon name="mail" size={20} color="#DE3B40" style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter Email"
                placeholderTextColor="#DE3B40"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {!isLoggedIn && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.textbox}>
                <Icon name="mobile1" size={20} color="#DE3B40" style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#DE3B40"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
          )}

          <View style={styles.termsContainer}>
            <CustomCheckbox label="I agree with Terms & Conditions" />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={isLoggedIn ? handleLogin : handleSignUp}
          >
            <Text style={styles.buttonText}>{isLoggedIn ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isLoggedIn ? "Don't have an account?" : 'Already have an account?'}
        </Text>
        <TouchableOpacity onPress={() => setIsLoggedIn(!isLoggedIn)}>
          <Text style={styles.toggleText}>{isLoggedIn ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
;

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: '#FFF',
  },
  content: {
    flexGrow: 1,
  },
  heading: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#171A1F',
    marginBottom: height * 0.01,
    marginTop: height * 0.05,
  },
  subheading: {
    fontSize: width * 0.05,
    fontWeight: '300',
    color: '#9095A1',
    marginBottom: height * 0.02, 
    marginVertical:height * 0.0, 
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', 
    paddingHorizontal: width * 0.05,
  },
  inputContainer: {
    marginBottom: height * 0.02, 
  },
  label: {
    fontSize: width * 0.05, 
    fontWeight: '700',
    color: '#171A1F',
    marginBottom: height * 0.02, 
    marginVertical: height * 0.04, 
  },
  textbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F2',
    borderRadius: width * 0.02, 
    paddingHorizontal: width * 0.03, 
    height: height * 0.06, 
    marginBottom: height * 0.01, 
  },
  textInput: {
    flex: 1,
    fontSize: width * 0.04, 
    color: '#171A1F',
    height: '100%',
  },
  icon: {
    marginRight: width * 0.02, 
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  button: {
    backgroundColor: '#DE3B40',
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.07,
    marginTop: height * 0.04,
    marginBottom: height * 0.15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: width * 0.045,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    backgroundColor: '#FFF',
  }, 
  footerText: {
    fontSize: width * 0.035,
    color: '#171A1F',
  },
  toggleText: {
    fontSize: width * 0.035,
    color: '#DE3B40',
    fontWeight: '700',
    marginLeft: width * 0.01,
    
  },
});