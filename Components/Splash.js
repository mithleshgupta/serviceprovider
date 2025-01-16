import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Splash() {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Welcome');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/splash.png')} style={styles.image} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF3C3C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});
