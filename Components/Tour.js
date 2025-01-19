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
  FlatList,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeleteIcon from 'react-native-vector-icons/AntDesign';

import TimeSlotPicker from './TimeSlotPicker ';
import DayTimeList from './DayTimeList';
import DayTimeManager from './DayTimeManager';
import TourSelection from './TourSelection ';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import mime from 'mime';
import CategoryDropdown from './TourSelection ';
import SelectCity from './CitySelection';

const { width, height } = Dimensions.get('window');

export default function Tour() {

  const route = useRoute()
  const navigation = useNavigation();
  const { tourId, tourName } = route.params;
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);

  const [media, setMedia] = useState([]);
  const [languages, setLanguages] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderImage, setLeaderImage] = useState(null);
  const [leaderDescription, setLeaderDescription] = useState('');
  const [daysData, setDaysData] = useState([]);
  const [timeRanges, setTimeRanges] = useState([]);
  const [title, setTitle] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [tourIncludes, setTourIncludes] = useState([]);
  const [tourExcludes, setTourExcludes] = useState([]);
  const [includeText, setIncludeText] = useState('');
  const [excludeText, setExcludeText] = useState('');
  const [days, setDays] = useState([]);
  const [dayText, setDayText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [activeDayId, setActiveDayId] = useState(null);

  const addInclude = () => {
    if (includeText.trim() !== '') {
      setTourIncludes([...tourIncludes, includeText.trim()]);
      setIncludeText('');
    }
  };



  const addExclude = () => {
    if (excludeText.trim() !== '') {
      setTourExcludes([...tourExcludes, excludeText.trim()]);
      setExcludeText('');
    }
  };


  const addDay = () => {
    if (dayText.trim() !== '') {
      setDays([
        ...days,
        { id: Date.now().toString(), day: dayText, times: [] },
      ]);
      setDayText('');
      setActiveDayId(null);
    }
  };


  const addTime = () => {
    if (timeText.trim() !== '' && activeDayId) {
      setDays(
        days.map((day) =>
          day.id === activeDayId
            ? { ...day, times: [...day.times, timeText.trim()] }
            : day
        )
      );
      setTimeText('');
    }
  };

  const deleteTime = (dayId, timeIndex) => {
    setDays(
      days.map((day) =>
        day.id === dayId
          ? { ...day, times: day.times.filter((_, index) => index !== timeIndex) }
          : day
      )
    );
  };


  const deleteDay = (dayId) => {
    setDays(days.filter((day) => day.id !== dayId));
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

  const editMedia = async (index) => {
    const options = {
      mediaType: 'mixed',
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const selected = response.assets?.[0];

        if (selected) {
          if (
            (selected.type?.includes('image') && selected.fileSize <= 10000000) ||
            (selected.type?.includes('video') && selected.fileSize <= 50000000)
          ) {
            const updatedMedia = [...media];
            updatedMedia[index] = selected; // Replace media at the specific index
            setMedia(updatedMedia);
          } else {
            Alert.alert('Error', 'Selected media exceeds allowed size limits.');
          }
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



        <TextInput style={styles.mainTitle} placeholder='Enter tour title' placeholderTextColor="#666" value={title} onChangeText={setTitle} />


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
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => editMedia(index)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </Swiper>

              {media.length < 4 && (
                <TouchableOpacity style={styles.addButton} onPress={pickMedia}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>


        <View style={styles.inputRow}>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter Language/s in which tour/walk is offered"
            placeholderTextColor="#666"
            value={languages}
            onChangeText={setLanguages}
          />
          <TextInput
            style={styles.halfInput}
            multiline
            placeholder="Enter Price of Tour/Walk per person in INR"
            placeholderTextColor="#666"
            value={price.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ''))}
          />

        </View>

        <View>
          <Text style={styles.titleHeader}>
            Discription
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Description (Up to 200 words)"
            placeholderTextColor="#666"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>



        <View style={styles.meetingPoint}>
          <Text style={styles.titleHeader}>Meeting Point : </Text>
          <TextInput style={styles.underInput} placeholder='Meeting Point' placeholderTextColor="#666" value={meetingPoint} onChangeText={setMeetingPoint} />
        </View>

        <View style={styles.duration}>
          <Text style={styles.titleHeader}>Duration of Tour/Walk:</Text>
          <TextInput
            style={styles.underInput}
            placeholder="Duration of Tour/Walk"
            placeholderTextColor="#666"
            value={duration}
            onChangeText={setDuration}
          />
        </View>


        <View style={styles.rowContainer}>

          <View style={styles.section}>
            <Text style={styles.title}>Includes</Text>
            <FlatList
              data={tourIncludes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.bulletPoint}>• {item}</Text>
              )}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter an include"
                placeholderTextColor="#666"
                value={includeText}
                onChangeText={setIncludeText}
              />
              <TouchableOpacity style={styles.addButton} onPress={addInclude}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={styles.section}>
            <Text style={styles.title}>Excludes</Text>
            <FlatList
              data={tourExcludes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.bulletPoint}>• {item}</Text>
              )}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#666"
                placeholder="Enter an exclude"
                value={excludeText}
                onChangeText={setExcludeText}
              />
              <TouchableOpacity style={styles.addButton} onPress={addExclude}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>



        <View style={styles.leaderContainer}>

          <View style={styles.leaderDetails}>
            <Text style={styles.title}>Tour leader:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tour Leader Name"
              placeholderTextColor="#666"
              value={leaderName}
              onChangeText={setLeaderName}
            />
          </View>

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


        <FlatList
          data={days}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.dayContainer}>
             
              <View style={styles.dayTimeContainer}>
                <View style={styles.dayRow}>
                  <Text style={styles.dayName}>{item.day}</Text>
                  <TouchableOpacity onPress={() => deleteDay(item.id)}>
                    <DeleteIcon name="delete" size={28} style={styles.icon} />
                  </TouchableOpacity>
                </View>


                
                <View style={styles.timesRow}>
                  {item.times.map((time, index) => (
                    <View key={index} style={styles.timeChip}>
                      <Text style={styles.timeText}>{time}</Text>
                      <TouchableOpacity
                        style={styles.deleteButtonTiny}
                        onPress={() => deleteTime(item.id, index)}
                      >
                        <Text style={styles.deleteButtonText}>-</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              
              {activeDayId === item.id && (
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="Enter time (e.g., 7 PM)"
                    value={timeText}
                    placeholderTextColor="#666"
                    onChangeText={setTimeText}
                  />
                  <TouchableOpacity
                    style={styles.addButtonSmall}
                    onPress={() => addTime(item.id)}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}


              {activeDayId !== item.id && (
                <TouchableOpacity
                  style={styles.addButtonSmall}
                  onPress={() => setActiveDayId(item.id)}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footer}>

              <TextInput
                style={styles.input}
                placeholder="Add a day (e.g., Monday)"
                value={dayText}
                placeholderTextColor="#666"
                onChangeText={setDayText}
              />
              <TouchableOpacity style={styles.addButton} onPress={addDay}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          }
        />
        <View style={styles.screen}>
          <CategoryDropdown onSelect={(id) => setSelectedTourId(id)} />
          <SelectCity onSelect={(id) => setSelectedCityId(id)} />
        </View >
      

        <View style={styles.meetingPoint}>
          <Text style={styles.titleHeader}>Enter Contact Number : </Text>
          <TextInput
            style={styles.underInput}
            placeholder="Enter Guide Phone number"
            placeholderTextColor="#666"
            value={contactInfo.phone}
            onChangeText={(text) => setContactInfo({ ...contactInfo, phone: text })}
          />
        </View>
        <View style={styles.meetingPoint}>
          <Text style={styles.titleHeader}>Enter Email Id : </Text>
          <TextInput
            style={styles.underInput}
            placeholder="Enter Email Id"
            placeholderTextColor="#666"
            value={contactInfo.email}
            onChangeText={(text) => setContactInfo({ ...contactInfo, email: text })}
          />
        </View>



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
    height: "20%",
    marginBottom: height * 0.05,
    alignItems: 'center',

  },
  placeholder: {
    width: "100%",
    height: "100%",
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
    width: "100%",
    height: "100%",
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: "100%",
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
    marginBottom: height * 0.01,
  },
  halfInput: {
    flex: 0.48,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
  underInput: {
    flex: width,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    marginBottom: 10
  },
  mainTitle: {
    flex: 0.48,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    marginBottom: 15
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
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
    fontSize: width * 0.02,
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
    marginTop: 20,
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
    backgroundColor: 'rgba(222, 59, 64, 0.7)',
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  titleHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  meetingPoint: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  duration: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 10
  },
  dayContainer: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dayRow: {
    flexDirection: 'row',        // Arrange children in a row
    alignItems: 'center',        // Vertically align items
    justifyContent: 'space-between', // Push elements to opposite ends
    marginBottom: 8,             // Add some spacing below the row
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

  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    flex: 1,
    marginHorizontal: 8,
  },
  leaderDetails: {
    flexDirection: 'row', // Aligns "Tour Leader" and input in a row
    alignItems: 'center', // Centers vertically
    width: '100%', // Ensures the row takes full width
    marginBottom: 10, // Adds spacing below this row
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    marginVertical: 4,
  },
  input: {

    borderColor: '#ccc',
    padding: 8,
    marginBottom: 25,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#FF5E5E',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButtonSmall: {
    backgroundColor: '#FF5E5E',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayName: {
    fontSize: 16,                // Text size for the day name
    fontWeight: 'bold',          // Make the day name bold
    color: '#333',               // Day name text color
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
    marginRight: 8,
  },
  timesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
    flex: 1,
  },

  dayTimeContainer: {
    display: "flex",
    flexDirection: "row"
  },


  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeChip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  deleteButtonSmall: {
    backgroundColor: '#FF5E5E',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonTiny: {
    backgroundColor: '#FF5E5E',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    color: '#FF5E5E',
    marginLeft: 8,
  },
  screen: {
    flex: 1,
    alignItems: 'flex-start',

  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ff9800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

});
