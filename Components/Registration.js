import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '@env';
import Icon from 'react-native-vector-icons/AntDesign';
import Menu, { MenuItem } from 'react-native-material-menu';

const { width, height } = Dimensions.get('window');

export default function Registration() {
  const [tours, setTours] = useState([{ tour_name: "", tour_id: null }, { tour_name: "", tour_id: null }, { tour_name: "", tour_id: null }, { tour_name: "", tour_id: null }, { tour_name: "", tour_id: null }]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTourIndex, setSelectedTourIndex] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;


  const navigation = useNavigation();

  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsMenuVisible(false));
    } else {
      setIsMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: width * 0.3,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleMenuItemPress = (item) => {
    if (item === 'Contact Us') {
      console.log('Navigating to Contact Us...');

    } else if (item === 'Log Out') {
      console.log('Logging out...');

    }
    setIsMenuVisible(false);
  };


  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Error: Authentication token is missing");
        return;
      }

      const response = await fetch(
        `https://correctedservice-production.up.railway.app/api/tours/user/tourTitles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedTours = data.tours.map((tour) => ({
          tour_name: tour.tour_name,
          tour_id: tour.tour_id,
        }));

        const finalTours = [
          ...updatedTours,
          ...new Array(5 - updatedTours.length).fill({
            tour_name: "",
            tour_id: null,
          }),
        ];
        setTours(finalTours);
      } else {
        console.error("Error:", data.message || "Failed to fetch tours");
      }
    } catch (error) {
      console.error("Error fetching tours:", error.message || error);
    }
  };





  const openDeleteModal = (index) => {
    setSelectedTourIndex(index);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    const selectedTour = tours[selectedTourIndex];
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.error("Error: Authentication token is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://correctedservice-production.up.railway.app/api/tours/delete/${selectedTour.tour_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data.message || "Tour deleted successfully");
        setIsModalVisible(false);
        setSelectedTourIndex(null);

        // Refresh the tours list
        fetchTours();
      } else {
        console.error("Error:", data.message || "Failed to delete tour");
      }
    } catch (error) {
      console.error("Error deleting tour:", error.message || error);
    }
  };



  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedTourIndex(null);
  };

  const handleInputChange = (text, index) => {
    const updatedTours = [...tours];
    updatedTours[index] = text;
    setTours(updatedTours);
  };

  const handleFieldPress = (index) => {
    const selectedTour = tours[index];
    console.log("this is selected", selectedTour);
    navigation.navigate('Tour', {
      tourId: selectedTour.tour_id || null,
      tourName: selectedTour.tour_name || ""
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (isMenuVisible) toggleMenu();
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Registration</Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.burgerButton}>
              <Icon name="menuunfold" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          {isMenuVisible && (
            <Animated.View
              style={[
                styles.menuContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  console.log('Contact Us');
                  toggleMenu(); // Close the menu after selecting an item
                }}
              >
                <Text style={styles.menuText}>Contact Us</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  console.log('Log Out');
                  toggleMenu(); // Close the menu after selecting an item
                }}
              >
                <Text style={styles.menuText}>Log Out</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.content}>
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <Text style={styles.descriptionText}>
              Here is what you need to do to register your services.
            </Text>

            {tours.map((tour, index) => (
              <TouchableOpacity key={index} onPress={() => handleFieldPress(index)}>
                <View style={styles.tourItem}>
                  <TextInput
                    style={styles.tourInput}
                    placeholder={`+ Experimental Tour/Walk ${index + 1}`}
                    placeholderTextColor="#9095A1"
                    value={tour.tour_name}
                    onChangeText={(text) => handleInputChange(text, index)}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => openDeleteModal(index)}
                  >
                    <Icon name="delete" size={28} style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        transparent
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete Experimental Tour/Walk{' '}
              {selectedTourIndex + 1}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDelete}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FF5E5E',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: width * 0.01,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#FFF',
  },
  burgerButton: {
    position: "absolute",
    right: width * 0.05,
    alignSelf: "flex-end",
    padding: 10,
  },
  burgerLine: {
    width: 25,
    height: 3,
    backgroundColor: '#FFF',
    marginVertical: 2,
    borderRadius: 2,
  },
  menuContainer: {
    position: 'absolute',
    top: 10,
    bottom: 0,
    width: width * 0.7,
    height: height * 0.2,
    backgroundColor: '#FFF',
    borderLeftWidth: 1,
    borderColor: '#DDD',
    paddingTop: height * 0.04,
    elevation: 5,
    zIndex: 1000,
    right: 0,
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
  content: {
    padding: width * 0.05,
  },
  welcomeTitle: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#000',
    marginBottom: height * 0.02,
  },
  descriptionText: {
    fontSize: width * 0.05,
    fontWeight: '400',
    color: '#9095A1',
    marginBottom: height * 0.03,
  },
  tourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottomColor: '#E0E0E0',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.02,
  },
  tourInput: {
    flex: 1,
    fontSize: width * 0.045,
    fontWeight: '400',
    color: '#333',
    borderBottomWidth: 1,
    width: width * 0.5,
    borderBottomColor: '#CCC',
    marginRight: 10,
    paddingVertical: 5,
  },
  deleteButton: {


    width: width * 0.1,
    height: height * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,

  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: '700', // Bold text
    fontSize: width * 0.05, // Adjusted font size to fit the modern button
    textAlign: 'center',
  },



  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontWeight: '600',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#FF6E6E',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    fontWeight: '600',
    color: '#FFF',
  },
});
