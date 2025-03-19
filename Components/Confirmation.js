import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Confirmation() {
    const navigation = useNavigation();

    function onClick() {
        navigation.navigate('Registration');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Image
                source={require("../assets/Success.png")}
                style={styles.image}
            />
            <Text style={styles.title}>Congratulations!!</Text>
            <Text style={styles.subtitle}>
                Your tour/walk has been successfully registered on STORYE
            </Text>
            <TouchableOpacity style={styles.button} onPress={onClick}>
                <Text style={styles.buttonText}>Add Another Experiential Tour/Walk</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DE3B40',
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    backButtonText: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    image: {
        width:200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#DE3B40',
    },
});
