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
                    navigation.navigate('Registration');
                } else {
                    navigation.navigate('Welcome');
                }
            } catch (error) {
                console.error('Error checking token:', error);
                navigation.navigate('Welcome');
            }
        };

        const timer = setTimeout(() => {
            checkTokenAndNavigate();
        }, 2000);

        return () => clearTimeout(timer);
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
        backgroundColor: '#E3292C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 400,
        height: 40000,
        resizeMode: 'contain',
    },
});
