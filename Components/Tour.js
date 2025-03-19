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
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeleteIcon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';

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
  const [isLoading, setIsLoading] = useState(false);

  const [media, setMedia] = useState([]);
  const [languages, setLanguages] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const [duration, setDuration] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderImage, setLeaderImage] = useState(null);
  const [coverPhoto, setcoverPhoto] = useState(null);

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
  const [leaderDescriptionWordCount, setLeaderDescriptionWordCount] = useState(0);


  const addInclude = () => {
    if (includeText.trim() !== '') {
      setTourIncludes([...tourIncludes, includeText.trim()]);
      setIncludeText('');
    }
  };

  const handleDescriptionChange = (text) => {

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (wordCount <= 250) {
      setDescription(text);
      setWordCount(wordCount);
    }
  };

  const handleLeaderDescriptionChange = (text) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (wordCount <= 150) {
      setLeaderDescription(text);
      setLeaderDescriptionWordCount(wordCount);
    }
  };

  const addExclude = () => {
    if (excludeText.trim() !== '') {
      setTourExcludes([...tourExcludes, excludeText.trim()]);
      setExcludeText('');
    }
  };


  const addDay = () => {
    if (dayText.trim()) {
      const newDay = {
        id: new Date().getTime().toString(),
        day: dayText,
        times: [],
      };
      setDays([...days, newDay]);
      setDayText('');
    }
  };


  const addTime = (dayId) => {
    if (timeText.trim()) {
      const updatedDays = days.map((item) => {
        if (item.id === dayId) {
          return { ...item, times: [...item.times, timeText] };
        }
        return item;
      });
      setDays(updatedDays);
      setTimeText('');
    }
  };

  const deleteTime = (dayId, timeIndex) => {
    const updatedDays = days.map((item) => {
      if (item.id === dayId) {
        const updatedTimes = item.times.filter((_, index) => index !== timeIndex);
        return { ...item, times: updatedTimes };
      }
      return item;
    });
    setDays(updatedDays);
  };


  const deleteDay = (dayId) => {
    const updatedDays = days.filter((item) => item.id !== dayId);
    setDays(updatedDays);
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
            `https://latestservice-production.up.railway.app/api/tours/tours/${tourId}`,
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
            const tourData = data.tour;

            setTitle(tourData.tour_name);
            setDescription(tourData.tour_description);
            setLanguages(tourData.languages.join(','));
            setPrice(tourData.ticket_price);
            setLeaderName(tourData.leader_name);
            setLeaderDescription(tourData.leader_description);
            setContactInfo({
              name: tourData.guide_name,
              email: tourData.guide_email_id,
              phone: tourData.guide_phone,
            });

            if (tourData.cover_photo) {
              setcoverPhoto({ uri: tourData.cover_photo });
            }

            if (tourData.leader_profile_pic) {
              setLeaderImage({ uri: tourData.leader_profile_pic });
            }

            if (tourData.media) {
              setMedia(
                tourData.media.map((item) => ({
                  uri: item.media_url,
                  type: item.type,
                }))
              );
            }


            if (tourData.tour_days) {
              const parsedDays = tourData.tour_days.map((day) => ({
                id: Math.random().toString(36).substring(7),
                day: day.day.trim(),
                times: day.times.map((time) => time.trim()),
              }));
              setDays(parsedDays);
            }

            if (tourData.tour_duration) {
              setDuration(tourData.tour_duration.trim());
            }


            if (tourData.meeting_point) {
              setMeetingPoint(tourData.meeting_point);
            }

            if (tourData.tour_includes) {
              setTourIncludes(tourData.tour_includes);
            }

            if (tourData.tour_excludes) {
              setTourExcludes(tourData.tour_excludes);
            }

            if (tourData.category_id) {
              setSelectedTourId(tourData.category_id);
            }

            if (tourData.city_id) {
              setSelectedCityId(tourData.city_id);
            }
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









  const API_BASE_URL = 'https://latestservice-production.up.railway.app/api/tours';


  const prepareFormData = (formattedData, leaderImage, media, coverPhoto, days, meetingPoint, tourIncludes, tourExcludes) => {
    const formData = new FormData();


    Object.keys(formattedData).forEach((key) => {
      formData.append(key, formattedData[key]);
    });


    if (leaderImage) {
      if (leaderImage.uri && leaderImage.uri.startsWith('file://')) {
        formData.append('leader_profile_pic', {
          uri: normalizeUri(leaderImage.uri),
          type: leaderImage.type || mime.getType(leaderImage.uri),
          name: leaderImage.fileName || leaderImage.uri.split('/').pop(),
        });
      } else if (leaderImage.uri) {
        formData.append('leader_profile_pic', leaderImage.uri);
      }
    }


    if (coverPhoto) {
      if (coverPhoto.uri && coverPhoto.uri.startsWith('file://')) {
        formData.append('cover_photo', {
          uri: normalizeUri(coverPhoto.uri),
          type: coverPhoto.type || mime.getType(coverPhoto.uri),
          name: coverPhoto.fileName || coverPhoto.uri.split('/').pop(),
        });
      } else if (coverPhoto.uri) {
        formData.append('cover_photo', coverPhoto.uri);
      }
    }


    if (media && media.length > 0) {
      media.forEach((file) => {
        if (file.uri && file.uri.startsWith('file://')) {
          formData.append('media', {
            uri: normalizeUri(file.uri),
            type: mime.getType(file.uri),
            name: file.fileName || file.uri.split('/').pop(),
          });
        } else if (file.uri) {
          formData.append('media', file.uri);
        }
      });
    }


    if (meetingPoint) {
      formData.append('meeting_point', meetingPoint);
    }


    if (tourIncludes && tourIncludes.length > 0) {
      formData.append('tour_includes', JSON.stringify(tourIncludes));
    }

    if (tourExcludes && tourExcludes.length > 0) {
      formData.append('tour_excludes', JSON.stringify(tourExcludes));
    }


    if (days && days.length > 0) {
      days.forEach(day => {
        formData.append('days', JSON.stringify({
          day: day.day,
          times: day.times,
        }));
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
      setIsLoading(true);
      const formattedData = {
        tour_name: title,
        tour_title: title,
        tour_description: description,
        languages: JSON.stringify(languages.split(',')),
        ticket_price: price,
        leader_name: leaderName,
        leader_description: leaderDescription,
        guide_name: contactInfo.name,
        guide_email_id: contactInfo.email,
        guide_phone: contactInfo.phone,
        category_id: selectedTourId,
        city_id: selectedCityId,
        tour_duration: duration,
      };


      const formData = prepareFormData(
        formattedData,
        leaderImage,
        media,
        coverPhoto,
        days,
        meetingPoint,
        tourIncludes,
        tourExcludes
      );

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
    finally {
      setIsLoading(false);
    }

  };



  const [contactInfo, setContactInfo] = useState({

    name: '',
    email: '',
    phone: '',
  });

  const pickMedia = async () => {
    ImagePicker.openPicker({
      mediaType: 'any',
      cropping: false,
      multiple: true,
      compressImageQuality: 0.8,
    }).then(response => {
      const validItems = response.filter(item => {
        if (item.mime.includes('image') && item.size <= 100000) {
          return true;
        } else if (item.mime.includes('video') && item.size <= 50000000) {
          return true;
        } else {
          Alert.alert('Size Exceeded', `Selected ${item.mime.includes('image') ? 'image' : 'video'} exceeds the size limit.`);
          return false;
        }
      }).map(item => ({
        uri: item.path,
        type: item.mime,
        fileName: item.path.split('/').pop(),
      }));

      const updatedMedia = [...media, ...validItems].slice(0, 4);
      setMedia(updatedMedia);
    }).catch(error => {
      console.error('Error picking media:', error);
    });
  };


  const editMedia = async (index) => {
    const mediaItem = media[index];
    if (mediaItem.type.includes('image')) {
      ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 800,
        height: 800,
        compressImageQuality: 0.8,
      }).then(image => {
        if (image.size <= 100000) {
          const updatedMedia = [...media];
          updatedMedia[index] = { uri: image.path, type: image.mime, fileName: image.path.split('/').pop() };
          setMedia(updatedMedia);
        } else {
          Alert.alert('Size Exceeded', 'Selected image exceeds the size limit of 100 KB.');
        }
      }).catch(error => {
        console.error('Error picking image:', error);
      });
    } else {
      Alert.alert('Edit Not Supported', 'Editing is only supported for images.');
    }
  };




  const pickLeaderImage = async () => {
    ImagePicker.openPicker({
      mediaType: 'any',
      cropping: false, 
    }).then(item => {
      if (item.mime.includes('image') && item.size <= 100000) {
        ImagePicker.openCropper({
          path: item.path,
          width: 500,
          height: 500,
          cropperCircleOverlay: true,
          compressImageQuality: 0.8,
        }).then(croppedImage => {
          setLeaderImage({ uri: croppedImage.path, type: croppedImage.mime });
        }).catch(error => {
          console.error('Error cropping image:', error);
        });
      } else if (item.mime.includes('video') && item.size <= 50000000) {
        setLeaderImage({ uri: item.path, type: item.mime });
      } else {
        Alert.alert('Size Exceeded', `Selected ${item.mime.includes('image') ? 'image' : 'video'} exceeds the size limit.`);
      }
    }).catch(error => {
      console.error('Error picking media:', error);
    });
  };

  const pickCoverPhoto = async () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
    }).then(image => {
      if (image.size <= 100000) {
        ImagePicker.openCropper({
          path: image.path,
          width: 1000,
          height: 1000,
          compressImageQuality: 0.8,
        }).then(croppedImage => {
          setcoverPhoto({ uri: croppedImage.path, type: croppedImage.mime });
        }).catch(error => {
          console.error('Error cropping image:', error);
        });
      } else {
        Alert.alert('Size Exceeded', 'Selected image exceeds the size limit of 100 KB.');
      }
    }).catch(error => {
      console.error('Error picking image:', error);
    });
  };

  const removeCoverPhoto = () => {
    setcoverPhoto(null);
  };

  console.log("these are the valus days,", days)
  return (
    <ScrollView
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
                    {
                      media.length === 4 && (
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => editMedia(index)}
                        >
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                      )
                    }

                  </View>
                ))}
              </Swiper>

              {media.length < 4 && (
                <TouchableOpacity style={styles.addButtonSwiper} onPress={pickMedia}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.coverPhotoContainer}>
          <Text style={styles.coverPhotoLabel}>Upload Cover Photo</Text>
          {coverPhoto ? (
            <View style={styles.coverPhotoWrapper}>
              <Image
                source={{ uri: coverPhoto.uri }}
                style={styles.coverPhoto}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeCoverPhotoButton}
                onPress={removeCoverPhoto}
              >
                <Text style={styles.removeCoverPhotoText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.coverPhotoPlaceholder}
              onPress={pickCoverPhoto}
            >
              <Text style={styles.coverPhotoPlaceholderText}>Add Cover Photo</Text>
              <Text style={styles.coverPhotoSizeText}>Image size up to 100 KB</Text>

            </TouchableOpacity>
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

        <View style={styles.descriptionContainer}>
          <Text style={styles.titleHeader}>Description</Text>
          <TextInput
            style={styles.textInputDescription}
            placeholder="Description (Up to 250 words)"
            placeholderTextColor="#666"
            multiline
            value={description}
            onChangeText={handleDescriptionChange}
            maxLength={1200}
            scrollEnabled
          />

          <Text style={styles.wordCount}>
            {wordCount} / 250 words
          </Text>
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

          <TouchableOpacity onPress={pickLeaderImage} style={styles.media}>
            {leaderImage && leaderImage.uri ? (
              leaderImage.type?.includes('video') ? (

                <Video
                  source={{ uri: leaderImage.uri }}
                  style={styles.media}
                  resizeMode="contain"
                  controls={true}
                  paused={false}
                />
              ) : (

                <Image
                  source={{ uri: leaderImage.uri }}
                  style={styles.media}
                />
              )
            ) : (


              <>
                <Text>Add  a short video or photo of the tour leader</Text>
                <Text>Video size upto 50 MB
                  Image size upto 100 kB </Text>
              </>

            )}
          </TouchableOpacity>



          <TextInput
            style={styles.textInput}
            placeholder="Short description about tour leader (Up to 150 words)"
            placeholderTextColor="#666"
            multiline
            value={leaderDescription}
            onChangeText={handleLeaderDescriptionChange}
          />
          <Text style={styles.wordCounter}>
            {leaderDescriptionWordCount}/150 words
          </Text>
        </View>


        <Text style={styles.slotHeader}>Day/s on which Tour or walk is conducted</Text>


        <View style={{ flex: 1 }}>
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

                {activeDayId === item.id ? (
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
                ) : (
                  <View style={styles.placeholderContainer}>
                    <TouchableOpacity
                      style={styles.addButtonSmall}
                      onPress={() => setActiveDayId(item.id)}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.placeholderText}>Click "+" to add timing</Text>
                  </View>
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
            contentContainerStyle={{ paddingBottom: 5 }}
            keyboardShouldPersistTaps="handled"
          />
        </View>

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

      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLoading(false)}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#DE3B40" />
            <Text style={styles.loadingText}>Registering...</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.03,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: '700',
    marginBottom: height * 0.02,
  },
  mediaContainer: {
    height: "12%",
    marginBottom: height * 0.05,
    alignItems: 'center',

  },
  addButtonSwiper: {
    position: 'absolute',
    top: 15,
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
    flex: 1,
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
    marginTop: "10%",
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
  // mainTitle: {
  //   flex: 0.48,
  //   borderBottomWidth: 1,
  //   borderColor: '#ccc',
  //   paddingVertical: 5,
  //   justifyContent: 'center',
  //   alignItems: 'flex-start',
  //   marginBottom: 15
  // },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
  },
  wordCounter: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
    textAlign: "right",
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
    marginBottom: 100
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
  // addButton: {
  //   position: 'absolute',
  //   bottom: 15,
  //   right: 15,
  //   backgroundColor: 'rgba(222, 59, 64, 0.7)',
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   elevation: 3,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 1.5,
  // },
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
    marginBottom: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timeInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },

  mainTitle: {
    fontSize: 18,
    flex: width,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    marginBottom: 16,
    textAlign: 'flex-start',
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,


    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  addButtonDay: {

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
  textInputDescription: {
    width: '100%',
    maxHeight: 200,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(222, 59, 64, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  coverPhotoContainer: {
    height: "10%",
    marginBottom: height * 0.10,
    alignItems: 'center',
  },
  coverPhotoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  coverPhotoSizeText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  coverPhotoWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: 'hidden',
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  coverPhotoPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhotoPlaceholderText: {
    color: '#888',
    textAlign: 'center',
  },
  removeCoverPhotoButton: {
    position: 'absolute',
    top: 15,
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
  removeCoverPhotoText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  media: {
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: 5,
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 200,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,

  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#DE3B40',
  },
});
