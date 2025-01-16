import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';

export default function TourDetails() {
    const [tourData, setTourData] = useState({
        images: [],
        title: '',
        description: '',
        leaderName: '',
        leaderImage: '',
        days: '',
        timings: '',
        contact: {
            name: '',
            number: '',
            email: '',
        },
    });

    // Simulating API call
    useEffect(() => {
        // Fetch data from API and update state
        // Example:
        // setTourData(responseData);
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* Title */}
            <Text style={styles.header}>{tourData.title || 'Tour title'}</Text>

            {/* Slider */}
            <View style={styles.sliderContainer}>
                <Swiper autoplay showsPagination>
                    {tourData.images.length > 0 ? (
                        tourData.images.map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.sliderImage} />
                        ))
                    ) : (
                        <View style={styles.placeholderSlider}><Text>No Images Available</Text></View>
                    )}
                </Swiper>
            </View>

            {/* Description */}
            <Text style={styles.sectionHeader}>Description</Text>
            <Text style={styles.description}>{tourData.description || 'A short description about the tour/walk.'}</Text>

            {/* Leader Info */}
            <Text style={styles.sectionHeader}>Tour/Walk Leader</Text>
            <View style={styles.leaderContainer}>
                {/* <Image
                    source={tourData.leaderImage ? { uri: tourData.leaderImage } : require('../assets/defaultProfile.png')}
                    style={styles.leaderImage}
                /> */}
                <Text style={styles.leaderName}>{tourData.leaderName || 'Arshad Khan'}</Text>
                <Text style={styles.leaderDesc}>A short description about the leader and team members.</Text>
            </View>

            
            <View style={styles.infoSection}>
                <Text style={styles.sectionHeader}>Days of Tour/Walk:</Text>
                <Text style={styles.infoValue}>{tourData.days || 'Not Available'}</Text>
                <Text style={styles.sectionHeader}>Timings:</Text>
                <Text style={styles.infoValue}>{tourData.timings || 'Not Available'}</Text>
            </View>

           
            <Text style={styles.sectionHeader}>Contact Details</Text>
            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{tourData.contact?.name || 'Not Available'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Contact Number:</Text>
                    <Text style={styles.infoValue}>{tourData.contact?.number || 'Not Available'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email Id:</Text>
                    <Text style={styles.infoValue}>{tourData.contact?.email || 'Not Available'}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 16,
    },
    sliderContainer: {
        height: 200,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    sliderImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderSlider: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom:20,
        marginHorizontal: 16,
    },
    description: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#555',
    },
    leaderContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    leaderImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
    },
    leaderName: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    leaderDesc: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginHorizontal: 16,
    },
    infoSection: {
        marginBottom: 16,
        paddingLeft: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        marginLeft: 20
    },
});
