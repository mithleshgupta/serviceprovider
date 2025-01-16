import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Confirmation() {
    const navigation = useNavigation();
    const route = useRoute();

    function onClick() {
        navigation.navigate('Registration'); 
    }

    return (
        <View style={styles.container}>
            <Text style={styles.confirmation}>Confirmation</Text>
            <TouchableOpacity style={styles.button} onPress={onClick}>
                <Text style={styles.buttonText}>Add Another Experimental Tour/Walk</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    confirmation: {
        fontSize: 32,
        fontWeight: '700',
        color: '#171A1F',
        marginBottom: 20,
    },
    button: {
        width: '80%',
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DE3B40',
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#DE3B40',
    },
});
