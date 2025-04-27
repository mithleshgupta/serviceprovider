import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

export default function Verification() {
    return (
        <View style={styles.container}>
            <Image source={require('./../assets/Verification.png')} style={styles.image} />
            <View style={styles.mainHeadingContainer}>
                <Text style={styles.mainHeading}>Verification Under Process</Text>
               
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
        alignItems: 'center',
        backgroundColor: '#DE3B40',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    image: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        marginTop: 60,
    
    },
    mainHeadingContainer: {
        marginBottom: 2,
    },
    mainHeading: {
        fontFamily: 'Poppins',
        fontSize: 34,
        fontWeight: '700',
        color: '#FFF',
        textAlign: 'center',
        alignSelf:"center",
        
        marginTop:50
    },
    subText: {
        fontFamily: 'Poppins',
        fontSize: 20,
        fontWeight: '400',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 24,
        marginTop: 100,
    },
});
