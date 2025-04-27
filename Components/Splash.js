import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash() {
    const navigation = useNavigation();

    useEffect(() => {
        const checkTokenAndNavigate = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Registration' }],
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                    });
                }
            } catch (error) {
                console.error('Error checking token:', error);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }], // Reset stack to Welcome on error
                });
            }
        };

        const timer = setTimeout(() => {
            checkTokenAndNavigate();
        }, 2000); // Delay for splash screen

        return () => clearTimeout(timer); // Cleanup timer
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/STORYElogofinal.png')} style={styles.image} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3292C', // Retain the red background
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 400,
        height: 400, // Corrected height
        resizeMode: 'contain', // Ensure the image scales properly
    },
});
