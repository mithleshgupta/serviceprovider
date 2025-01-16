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
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import mime from 'mime';

const { width, height } = Dimensions.get('window');

export default function Tour() {

  const route = useRoute()
  const navigation = useNavigation();
  const { tourId, tourName } = route.params;
  const [selectedTourId, setSelectedTourId] = useState(null);

  const [media, setMedia] = useState([]);
  const [languages, setLanguages] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderImage, setLeaderImage] = useState(null);
  const [leaderDescription, setLeaderDescription] = useState('');
  const [daysData, setDaysData] = useState([]);
  const [timeRanges, setTimeRanges] = useState([]);
  const [title, setTitle] = useState('');


  const handleAddDay = () => {
    setDaysData([...daysData, { day: '', timeRanges: [{ startTime: '', endTime: '' }] }]);
  };




  const handleDayChange = (index, text) => {
    const updatedDaysData = [...daysData];
    updatedDaysData[index].day = text;
    setDaysData(updatedDaysData);
  };

  const handleTimeRangeChange = (dayIndex, timeIndex, field, value) => {
    const updatedDaysData = [...daysData];
    updatedDaysData[dayIndex].timeRanges[timeIndex][field] = value;
    setDaysData(updatedDaysData);
  };


  const handleAddTimeSlot = (index) => {
    const newDaysData = [...daysData];
    newDaysData[index].timeRanges.push({ startTime: '', endTime: '' });
    setDaysData(newDaysData);
  };


  const handleRemoveTimeSlot = (dayIndex, timeIndex) => {
    const updatedDaysData = [...daysData];
    updatedDaysData[dayIndex].timeRanges.splice(timeIndex, 1);
    setDaysData(updatedDaysData);
  };

  const handleRemoveDay = (index) => {
    const newDaysData = [...daysData];
    newDaysData.splice(index, 1);
    setDaysData(newDaysData);
  };

  const updateDaysData = (updatedData) => {
    setDaysData(updatedData);
  };

  const normalizeUri = (uri) => {
    return Platform.OS === 'android' ? `file:///${uri.replace('file:/', '')}` : uri;
  };

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
            `https://correctedservice-production.up.railway.app/api/tours/tours/${tourId}`,
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
            setLanguages(tourData.languages.join(','));
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





  const API_BASE_URL = 'https://correctedservice-production.up.railway.app/api/tours';


  const prepareFormData = (formattedData, leaderImage, media) => {
    const formData = new FormData();

    // Add all text fields
    Object.keys(formattedData).forEach((key) => {
      formData.append(key, formattedData[key]);
    });

    // Leader profile picture
    if (leaderImage) {
      if (leaderImage.uri && leaderImage.uri.startsWith('file://')) {
        // Local file
        formData.append('leader_profile_pic', {
          uri: normalizeUri(leaderImage.uri),
          type: leaderImage.type || mime.getType(leaderImage.uri),
          name: leaderImage.fileName || leaderImage.uri.split('/').pop(),
        });
      } else if (leaderImage.uri) {
        // S3 URL
        formData.append('leader_profile_pic', leaderImage.uri);
      }
    }

    // Media files
    if (media && media.length > 0) {
      media.forEach((file) => {
        if (file.uri && file.uri.startsWith('file://')) {
          // Local file
          formData.append('media', {
            uri: normalizeUri(file.uri),
            type: mime.getType(file.uri),
            name: file.fileName || file.uri.split('/').pop(),
          });
        } else if (file.uri) {
          // S3 URL
          formData.append('media', file.uri);
        }
      });
    }

    return formData;
  };



  const handleUpdate = async () => {

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication token is missing');
      return;
    }

    try {
      const formattedData = {
        tour_name: title,
        tour_title: title,
        tour_description: description,
        languages: JSON.stringify(languages.split(',')),
        ticket_price: price,
        leader_name: leaderName,
        leader_description: leaderDescription,
        tour_days: JSON.stringify(daysData.map((day) => day.day)),

        // Map the day and time ranges into the correct format for 'tour_timings'
        tour_timings: JSON.stringify(
          daysData.map((day) => ({
            day: day.day,
            timings: day.timeRanges.map((timeRange) => ({
              start_time: timeRange.startTime,
              end_time: timeRange.endTime,
            })),
          }))
        ),


        guide_name: contactInfo.name,
        guide_email_id: contactInfo.email,
        guide_phone: contactInfo.phone,
        category_id: selectedTourId,
        cities: JSON.stringify(["Pondicherry"]),
      };

      const formData = prepareFormData(formattedData, leaderImage, media);

      const response = await fetch(
        `${API_BASE_URL}/${tourId ? `update/${tourId}` : 'create'}`,
        {
          method: tourId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        navigation.navigate("Confirmation");
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };



  const [contactInfo, setContactInfo] = useState({

    name: '',
    email: '',
    phone: '',
  });

  const pickMedia = async () => {
    const options = {
      mediaType: 'mixed',
      selectionLimit: 4,
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const selected = response.assets?.filter(
          (item) =>
            (item.type?.includes('image') && item.fileSize <= 10000000) ||
            (item.type?.includes('video') && item.fileSize <= 50000000)
        );

        if (selected) {
          const updatedMedia = [...media, ...selected].slice(0, 4);
          setMedia(updatedMedia);
        }
      }
    });
  };




  const pickLeaderImage = async () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const newImage = response.assets[0];
        setLeaderImage({ uri: newImage.uri });
      }
    });
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >



        <TextInput style={styles.mainTitle} placeholder='Enter tour title' placeholderTextColor="#66" value={title} onChangeText={setTitle} />


        <View style={styles.mediaContainer}>
          {media.length === 0 ? (
            <TouchableOpacity style={styles.placeholder} onPress={pickMedia}>
              <Text style={styles.placeholderText}>
                Add Videos and Photos of Tour/Walk (Maximum 4){'\n'}
                Video size up to 50 MB (Max 1){'\n'}
                Image size up to 100 KB (Max 3)
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.container}>
              <Swiper
                style={styles.swiper}
                showsPagination
                paginationStyle={{ bottom: 10 }}
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
                loop={false}
                key={media.length}
              >
                {media.map((item, index) => (
                  <View key={`media-${index}`} style={styles.slide}>
                    {item.type?.includes('video') ? (
                      <Video
                        source={{ uri: item.uri }}
                        style={styles.image}
                        resizeMode="contain"
                        paused
                      />
                    ) : (
                      <Image source={{ uri: item.uri }} style={styles.image} />
                    )}
                  </View>
                ))}
              </Swiper>


              {media.length < 4 && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={pickMedia}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>


              )}
            </View>

          )}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter Language/s"
            placeholderTextColor="#666"
            value={languages}
            onChangeText={setLanguages}
          />
          <TextInput
            style={styles.halfInput}
            placeholder="Enter Price"
            placeholderTextColor="#666"
            value={price.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ''))}
          />

        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Description (Up to 200 words)"
          placeholderTextColor="#666"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.leaderContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Tour Leader Name"
            placeholderTextColor="#666"
            value={leaderName}
            onChangeText={setLeaderName}
          />
          <TouchableOpacity onPress={pickLeaderImage}>
            {leaderImage && leaderImage.uri ? (
              <Image
                source={{ uri: leaderImage.uri }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Icon name="person-circle-outline" size={100} color="#DE3B40" />
            )}
          </TouchableOpacity>



          <TextInput
            style={styles.textInput}
            placeholder="Short description about tour leader (Up to 100 words)"
            placeholderTextColor="#666"
            multiline
            value={leaderDescription}
            onChangeText={setLeaderDescription}
          />
        </View>


        <Text style={styles.slotHeader}>Available Days and Time Slots</Text>
        {daysData.map((dayData, dayIndex) => (
          <View key={dayIndex} style={styles.dayContainer}>
            {/* Input for day */}
            <TextInput
              style={styles.dayInput}
              placeholder="Day"
              value={dayData.day}
              onChangeText={(text) => handleDayChange(dayIndex, text)} // Update day value
            />

            {/* Add Time Range Button */}
            <TouchableOpacity onPress={() => handleAddTimeSlot(dayIndex)} style={[styles.addSlotButton, styles.floatingButton]}>
              <Text style={styles.addSlotButtonText} >+</Text>
            </TouchableOpacity>

            {/* Render Time Range Inputs */}
            {dayData.timeRanges.map((timeRange, timeIndex) => (
              <View key={timeIndex} style={styles.timeSlotContainer}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="Start Time"
                  value={timeRange.startTime}
                  onChangeText={(text) => handleTimeRangeChange(dayIndex, timeIndex, 'startTime', text)}
                />
                <TextInput
                  style={styles.timeInput}
                  placeholder="End Time"
                  value={timeRange.endTime}
                  onChangeText={(text) => handleTimeRangeChange(dayIndex, timeIndex, 'endTime', text)}
                />
                <TouchableOpacity
                  style={[styles.slotRemoveButton, styles.floatingButton]}
                  onPress={() => handleRemoveTimeSlot(dayIndex, timeIndex)}
                >
                  <Text style={styles.slotRemoveButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Remove Day Button */}
            <TouchableOpacity style={styles.removeDayButton} onPress={() => handleRemoveDay(dayIndex)}>
              <Text style={styles.removeDayButtonText}>Remove Day</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Button to add a new Day */}





        <TouchableOpacity style={styles.addDayButton} onPress={handleAddDay}>
          <Text style={styles.addDayButtonText}>Add Day</Text>
        </TouchableOpacity>



        <TouchableOpacity style={styles.button} onPress={handleAddDay}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>



        <TourSelection onSelect={(id) => setSelectedTourId(id)} />

        <TextInput
          style={styles.textInput}
          placeholder="Enter Guide Name"
          placeholderTextColor="#666"
          value={contactInfo.name}
          onChangeText={(text) => setContactInfo({ ...contactInfo, name: text })}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Enter Guide Email"
          placeholderTextColor="#666"
          value={contactInfo.email}
          onChangeText={(text) => setContactInfo({ ...contactInfo, email: text })}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Enter Guide Phone"
          placeholderTextColor="#666"
          value={contactInfo.phone}
          onChangeText={(text) => setContactInfo({ ...contactInfo, phone: text })}
        />



        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUpdate}
        >
          <Text style={styles.submitButtonText}>
            {tourId ? 'Update' : 'Register'}
          </Text>
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
    marginBottom: 20, // Space between days
    padding: 10,      // Padding inside the day block
    backgroundColor: '#f9f9f9', // Light background color
    borderRadius: 8,  // Rounded corners
    borderWidth: 1,   // Border around the day block
    borderColor: '#ccc', // Border color
  },
  dayInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayInput: {
    height: 40, // Height of the input field
    borderColor: '#ccc', // Border color for input
    borderWidth: 1,     // Border width
    borderRadius: 5,    // Rounded corners
    paddingHorizontal: 10, // Padding inside the input field
    marginBottom: 10,    // Space below the input field
  },
  timeSlotContainer: {
    flexDirection: 'row', // Time slots in a row
    marginBottom: 10,     // Space between time slots
  },
  timeInput: {
    height: 40,          // Height of the input field
    borderColor: '#ccc', // Border color
    borderWidth: 1,     // Border width
    borderRadius: 5,    // Rounded corners
    flex: 1,             // Each input takes equal space
    marginRight: 10,     // Space between the two time input fields
    paddingHorizontal: 10, // Padding inside the input field
  },
  addSlotButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 5
  },
  addSlotButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  slotRemoveButton: {
    backgroundColor: '#ff4d4d', // Red background for remove button
    justifyContent: 'center', // Center the text
    alignItems: 'center',     // Center the text
    width: 30,                // Width of the button
    height: 30,               // Height of the button
    borderRadius: 15,         // Round the button
  },
  slotRemoveButtonText: {
    color: '#fff',           // White text color
    fontWeight: 'bold',      // Bold text
    fontSize: 18,            // Font size
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
    backgroundColor: '#4CAF50', // Green background for "Add Day" button
    padding: 10,                // Padding inside the button
    borderRadius: 5,           // Rounded corners
    marginTop: 20,             // Space above the button
    alignItems: 'center',      // Center the text
  },
  addDayButtonText: {
    color: '#fff',            // White text color
    fontSize: 16,             // Font size
    fontWeight: 'bold',       // Bold text
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeDayButton: {
    backgroundColor: '#ff4d4d', // Red background for "Remove Day" button
    paddingVertical: 8,         // Padding above and below the text
    paddingHorizontal: 15,      // Padding on the sides
    borderRadius: 5,            // Rounded corners
    marginTop: 10,              // Space above the button
    alignItems: 'center',       // Center the text
  },
  // Remove Day button text
  removeDayButtonText: {
    color: '#fff',             // White text color
    fontSize: 16,              // Font size
    fontWeight: 'bold',        // Bold text
  },

});
