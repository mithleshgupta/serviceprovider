import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export default function Verification() {
    const { height } = Dimensions.get('window');

    return (
        <View style={styles.container}>
            <View style={[styles.mainHeadingContainer, { marginTop: -height * 0.1 }]}>
               
                <Text style={styles.mainHeading}>Verification Under</Text>
                <Text style={styles.mainHeading}>Process</Text>
            </View>
            <Text style={styles.subText}>
                We will notify you once your profile has been verified
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    mainHeadingContainer: {
        marginBottom: 120, 
    },
    mainHeading: {
        fontFamily: 'Poppins',
        fontSize: 28,
        fontWeight: '700',
        color: '#DE3B40',
        textAlign: 'center',
        lineHeight: 36,
    },
    subText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        fontWeight: '400',
        color: '#7A7A7A',
        textAlign: 'center',
        lineHeight: 24,
    },
});
