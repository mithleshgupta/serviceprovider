import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { launchImageLibrary } from 'react-native-image-picker';

const TourForm = () => {
    const [tourDetails, setTourDetails] = useState({
        title: '',
        description: '',
        languages: '',
        price: '',
        days: '',
        timings: '',
        city: '',
        category: '',
        contact: {
            name: '',
            number: '',
            email: '',
        },
    });

    const [leaderProfilePic, setLeaderProfilePic] = useState(null);
    const [media, setMedia] = useState([]);

    const handleTourDetailChange = (field, value) => {
        setTourDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleContactChange = (field, value) => {
        setTourDetails((prev) => ({
            ...prev,
            contact: { ...prev.contact, [field]: value },
        }));
    };

    const pickMedia = async () => {
        launchImageLibrary(
            { mediaType: 'mixed', selectionLimit: 5 },
            (response) => {
                if (response.assets) {
                    setMedia([...media, ...response.assets.map((asset) => asset.uri)]);
                }
            }
        );
    };

    const pickLeaderProfilePic = async () => {
        launchImageLibrary(
            { mediaType: 'photo', selectionLimit: 1 },
            (response) => {
                if (response.assets) {
                    setLeaderProfilePic(response.assets[0].uri);
                }
            }
        );
    };

    const handleRegister = () => {
        console.log('Tour Details:', tourDetails);
        console.log('Leader Profile Pic:', leaderProfilePic);
        console.log('Media:', media);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Enter Tour Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Title"
                value={tourDetails.title}
                onChangeText={(text) => handleTourDetailChange('title', text)}
            />

            <TouchableOpacity style={styles.mediaButton} onPress={pickLeaderProfilePic}>
                <Text style={styles.mediaButtonText}>Add Leader Profile Picture</Text>
            </TouchableOpacity>
            {leaderProfilePic && (
                <Image source={{ uri: leaderProfilePic }} style={styles.profileImage} />
            )}

            <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
                <Text style={styles.mediaButtonText}>Add Slider Media</Text>
            </TouchableOpacity>
            <View style={styles.sliderContainer}>
                <Swiper autoplay showsPagination>
                    {media.length > 0 ? (
                        media.map((uri, index) => (
                            <Image key={index} source={{ uri }} style={styles.sliderImage} />
                        ))
                    ) : (
                        <Text>No Media Selected</Text>
                    )}
                </Swiper>
            </View>

            <Text style={styles.label}>Enter Language(s) & Ticket Price:</Text>
            <TextInput
                style={styles.input}
                placeholder="Languages"
                value={tourDetails.languages}
                onChangeText={(text) => handleTourDetailChange('languages', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={tourDetails.price}
                onChangeText={(text) => handleTourDetailChange('price', text)}
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
                style={styles.textArea}
                multiline
                placeholder="Enter Description"
                value={tourDetails.description}
                onChangeText={(text) => handleTourDetailChange('description', text)}
            />

            <Text style={styles.label}>Days & Timings:</Text>
            <TextInput
                style={styles.input}
                placeholder="Days"
                value={tourDetails.days}
                onChangeText={(text) => handleTourDetailChange('days', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Timings"
                value={tourDetails.timings}
                onChangeText={(text) => handleTourDetailChange('timings', text)}
            />

            <Text style={styles.label}>City & Category:</Text>
            <TextInput
                style={styles.input}
                placeholder="City"
                value={tourDetails.city}
                onChangeText={(text) => handleTourDetailChange('city', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Category"
                value={tourDetails.category}
                onChangeText={(text) => handleTourDetailChange('category', text)}
            />

            <Text style={styles.label}>Contact Details:</Text>
            <TextInput
                style={styles.input}
                placeholder="Contact Name"
                value={tourDetails.contact.name}
                onChangeText={(text) => handleContactChange('name', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={tourDetails.contact.number}
                onChangeText={(text) => handleContactChange('number', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email ID"
                value={tourDetails.contact.email}
                onChangeText={(text) => handleContactChange('email', text)}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
        height: 100,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
    },
    sliderContainer: {
        height: 200,
        marginVertical: 10,
    },
    sliderImage: {
        width: '100%',
        height: '100%',
    },
    mediaButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    mediaButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    registerButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    registerButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default TourForm;
