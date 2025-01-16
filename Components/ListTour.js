import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
    DatePickerIOS,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TimeSlotPicker from './TimeSlotPicker ';
import DayTimeList from './DayTimeList';
import DayTimeManager from './DayTimeManager';
import TourSelection from './TourSelection ';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import mime from 'mime';

const { width, height } = Dimensions.get('window');




export default function ListTour() {
    const route = useRoute();
    const { tourId } = route.params;

    const [selectedTourId, setSelectedTourId] = useState(null);
    const [media, setMedia] = useState([]);
    const [languages, setLanguages] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [leaderImage, setLeaderImage] = useState(null);
    const [leaderDescription, setLeaderDescription] = useState('');
    const [daysData, setDaysData] = useState([]);
    const [contactInfo, setContactInfo] = useState({});
    const [title, setTitle] = useState('');

    const navigation = useNavigation();

    function handleUpdate() {
        navigation.navigate("Walks");
    }

    useEffect(() => {
        if (tourId) {
            const fetchTourData = async () => {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'Authentication token is missing');
                    return;
                }

                try {
                    const response = await fetch(
                        `https://f268-103-57-87-169.ngrok-free.app/api/tours/tours/${tourId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const data = await response.json();
                    console.log("Fetched Data: ", data);

                    if (response.ok && data.success) {
                        const tourData = data.tour;

                        setTitle(tourData.tour_name);
                        setLanguages(tourData.languages.join(', '));
                        setPrice(tourData.ticket_price);
                        setDescription(tourData.tour_description);
                        setLeaderName(tourData.leader_name);
                        setLeaderDescription(tourData.leader_description);

                        if (tourData.tour_days && tourData.tour_timings) {
                            const formattedDaysData = tourData.tour_days.map((day, index) => {
                                const timings = tourData.tour_timings[index].timings || [];
                                return {
                                    day,
                                    timeRanges: timings.map(timing => ({
                                        startTime: timing.start_time,
                                        endTime: timing.end_time,
                                    })),
                                };
                            });
                            setDaysData(formattedDaysData);
                        }

                        setMedia(
                            tourData.media.map(item => ({
                                uri: item.media_url,
                                type: item.type,
                            }))
                        );

                        if (tourData.leader_profile_pic) {
                            setLeaderImage({ uri: tourData.leader_profile_pic });
                        }

                        setContactInfo({
                            name: tourData.guide_name,
                            email: tourData.guide_email_id,
                            phone: tourData.guide_phone,
                        });
                    } else {
                        Alert.alert('Error', data.message || 'Failed to fetch tour data');
                    }
                } catch (error) {
                    Alert.alert('Error', 'Something went wrong while fetching tour data');
                    console.error(error);
                }
            };

            fetchTourData();
        }
    }, [tourId]);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.mainTitle}>{title}</Text>

                <View style={styles.mediaContainer}>
                    {media.length === 0 ? (
                        <Text style={styles.placeholderText}>No media available</Text>
                    ) : (
                        <Swiper style={styles.swiper} showsPagination paginationStyle={{ bottom: 10 }} loop={false}>
                            {media.map((item, index) => (
                                <View key={`media-${index}`} style={styles.slide}>
                                    {item.type?.includes('video') ? (
                                        <Video source={{ uri: item.uri }} style={styles.image} resizeMode="contain" paused />
                                    ) : (
                                        <Image source={{ uri: item.uri }} style={styles.image} />
                                    )}
                                </View>
                            ))}
                        </Swiper>
                    )}
                </View>

                <View style={styles.inputRow}>
                    <Text style={styles.halfInput}>{languages}</Text>
                    <Text style={styles.halfInput}>{price}</Text>
                </View>

                <Text style={styles.textInput}>{description}</Text>

                <View style={styles.leaderContainer}>
                    <Text style={styles.textInput}>{leaderName}</Text>
                    {leaderImage && <Image source={leaderImage} style={{ width: 100, height: 100, borderRadius: 50 }} />}
                    <Text style={styles.textInput}>{leaderDescription}</Text>
                </View>


                <View style={styles.slotHeaderContainer}>
                    <Text style={styles.slotHeader}>Available Days and Time Slots</Text>
                    {daysData.map((dayData, dayIndex) => (
                        <View key={dayIndex} style={styles.timeSlotContainer}>
                            <Text style={styles.dayText}>{dayData.day}</Text>
                            {dayData.timeRanges.map((timeRange, timeIndex) => (
                                <View key={timeIndex} style={styles.timeSlot}>
                                    <View key={timeIndex} style={styles.timeSlot}>
                                        <Text style={styles.timeText}>  {timeRange.startTime} {timeRange.endTime}</Text>
                                    </View>

                                </View>
                            ))}
                        </View>
                    ))}
                </View>


                <Text style={styles.textInput}>Guide Name: {contactInfo.name}</Text>
                <Text style={styles.textInput}>Guide Email: {contactInfo.email}</Text>
                <Text style={styles.textInput}>Guide Phone: {contactInfo.phone}</Text>

                <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                    <Text style={styles.submitButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.03,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: '700',
        marginBottom: height * 0.02,
    },
    mediaContainer: {
        marginBottom: height * 0.02,
        alignItems: 'center',
    },
    placeholder: {
        width: 335,
        height: 235,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    placeholderText: {
        textAlign: 'center',
        color: '#666',
    },
    swiper: {
        width: 335,
        height: 235,
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 235,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    videoText: {
        fontSize: 16,
        color: '#333',
    },
    addSlide: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        width: '100%',
        height: 235,
        borderRadius: 10,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.02,
    },
    halfInput: {
        flex: 0.48,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
    },
    mainTitle: {
        flex: 0.48,
        fontWeight: "800",
        fontSize: 20,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
        marginBottom: 15
    },
    textInput: {

        borderColor: '#ccc',
        paddingVertical: 5,
        marginBottom: height * 0.02,
    },
    leaderContainer: {
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    leaderImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: height * 0.01,
    },
    slotHeader: {
        fontSize: width * 0.05,
        fontWeight: '600',
        marginBottom: height * 0.01,
    },
    slotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: height * 0.015,
    },
    removeSlotButton: {
        backgroundColor: '#DE3B40',
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    removeSlotText: {
        color: '#fff',
    },
    addSlotButton: {
        alignItems: 'center',
        marginVertical: height * 0.02,
    },
    addSlotText: {
        color: '#007BFF',
        fontSize: width * 0.045,
    },
    submitButton: {
        backgroundColor: '#DE3B40',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 15
    },
    submitButtonText: {
        color: '#fff',
        fontSize: width * 0.05,
        fontWeight: '600',
    },
    swiperContainer: {
        width: '100%',
        height: 235,
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    swiper: {
        height: 235,
    },
    dot: {
        backgroundColor: '#ccc',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    addButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: 'rgba(222, 59, 64, 0.7)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    activeDot: {
        backgroundColor: '#333',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    videoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        width: '100%',
        height: '100%',
    },
    timeSlotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#eaeaea', // Light background for better visibility
        padding: 10,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc', // Lighter border for contrast
    },
    timeInput: {
        fontSize: 16,
        color: '#333', // Dark text color for better readability
        width: '45%',
        backgroundColor: '#fff', // White background for inputs to ensure visibility
        padding: 8,
        borderRadius: 8,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ccc', // Lighter border for input fields
    },
    timeText: {
        fontSize: 16, // Slightly larger text for better readability
        color: '#333', // A darker color for contrast
        textAlign: 'center', // Centers the text
        marginHorizontal: 5, // Adds space between the start and end times
    },
});
