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
import DateTimePicker from '@react-native-community/datetimepicker';

import TimeSlotPicker from './TimeSlotPicker ';
import DayTimeList from './DayTimeList';
import DayTimeManager from './DayTimeManager';
import TourSelection from './TourSelection ';
import Video from 'react-native-video';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import mime from 'mime';

const { width, height } = Dimensions.get('window');

export default function ListTour() {
    const route = useRoute();
    const { tourId } = route.params;

    const [tourData, setTourData] = useState({
        media: [],
        languages: '',
        price: '',
        description: '',
        leaderName: '',
        leaderImage: null,
        leaderDescription: '',
        daysData: [],
        title: '',
        contactInfo: { name: '', email: '', phone: '' },
    });

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
                        `https://72a2-103-57-87-2.ngrok-free.app/api/tours/tours/${tourId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const data = await response.json();

                    if (response.ok && data.success) {
                        const tour = data.tour;
                        setTourData({
                            title: tour.tour_name,
                            languages: tour.languages.join(', '),
                            price: tour.ticket_price,
                            description: tour.tour_description,
                            leaderName: tour.leader_name,
                            leaderDescription: tour.leader_description,
                            leaderImage: { uri: tour.leader_profile_pic },
                            contactInfo: {
                                name: tour.guide_name,
                                email: tour.guide_email_id,
                                phone: tour.guide_phone,
                            },
                            daysData: tour.tour_days.map((day, index) => ({
                                day,
                                timeRanges: tour.tour_timings[index]
                                    ? [{ startTime: tour.tour_timings[index].start, endTime: tour.tour_timings[index].end }]
                                    : [],
                            })),
                            media: tour.media.map(item => ({
                                uri: item.media_url,
                                type: item.type,
                            })),
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
                <Text style={styles.mainTitle}>{tourData.title}</Text>

                <View style={styles.mediaContainer}>
                    {tourData.media.length === 0 ? (
                        <Text style={styles.placeholderText}>No media available</Text>
                    ) : (
                        <Swiper style={styles.swiper} showsPagination paginationStyle={{ bottom: 10 }} loop={false}>
                            {tourData.media.map((item, index) => (
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
                    <Text style={styles.halfInput}>{tourData.languages}</Text>
                    <Text style={styles.halfInput}>{tourData.price}</Text>
                </View>

                <Text style={styles.textInput}>{tourData.description}</Text>

                <View style={styles.leaderContainer}>
                    <Text style={styles.textInput}>{tourData.leaderName}</Text>
                    <Image source={tourData.leaderImage} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    <Text style={styles.textInput}>{tourData.leaderDescription}</Text>
                </View>

                <Text style={styles.slotHeader}>Available Days and Time Slots</Text>
                {tourData.daysData.map((dayData, dayIndex) => (
                    <View key={dayIndex} style={styles.dayContainer}>
                        <Text style={styles.dayInput}>{dayData.day}</Text>
                        {dayData.timeRanges.map((timeRange, timeIndex) => (
                            <View key={timeIndex} style={styles.timeSlotContainer}>
                                <Text style={styles.timeInput}>{timeRange.startTime}</Text>
                                <Text style={styles.timeInput}>{timeRange.endTime}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                <Text style={styles.textInput}>Guide Name: {tourData.contactInfo.name}</Text>
                <Text style={styles.textInput}>Guide Email: {tourData.contactInfo.email}</Text>
                <Text style={styles.textInput}>Guide Phone: {tourData.contactInfo.phone}</Text>
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
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
        marginBottom: 15
    },
    textInput: {
        borderBottomWidth: 1,
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
    slotHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dayContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    dayInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginRight: 10,
    },
    timeSlotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    timeInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginRight: 10,
    },
    addSlotButton: {
        backgroundColor: '#28A745',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    addSlotButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    slotRemoveButton: {
        backgroundColor: '#DC3545',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    slotRemoveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    removeButton: {
        backgroundColor: '#DC3545',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addDayButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addDayButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

});
