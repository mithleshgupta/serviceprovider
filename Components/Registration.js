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
import RBSheet from 'react-native-raw-bottom-sheet';

const { width, height } = Dimensions.get('window');

export default function Registration() {
  const [tours, setTours] = useState([
    { tour_name: "", tour_id: null },
    { tour_name: "", tour_id: null },
    { tour_name: "", tour_id: null },
    { tour_name: "", tour_id: null },
    { tour_name: "", tour_id: null },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTourIndex, setSelectedTourIndex] = useState(null);
  const [isContactUsModalVisible, setIsContactUsModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const refRBSheet = useRef();
  const navigation = useNavigation();

  const toggleMenu = () => {
    refRBSheet.current.open();
  };

  const handleMenuItemPress = (item) => {
    if (item === 'Contact Us') {
      setIsContactUsModalVisible(true);
    } else if (item === 'Log Out') {
      setIsLogoutModalVisible(true);
    }
    refRBSheet.current.close();
  };

  const handleContactUsClose = () => {
    setIsContactUsModalVisible(false);
  };

  const handleLogoutClose = () => {
    setIsLogoutModalVisible(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Welcome');
    setIsLogoutModalVisible(false);
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Error: Authentication token is missing");
        navigation.navigate("Welcome");
        return;
      }

      const response = await fetch(
        `https://latestservice-production.up.railway.app/api/tours/user/tourTitles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.tours.length === 0) {
          console.log("No tours found. Prompt user to create one.");
          return;
        }

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
      } else if (response.status === 401) {
        console.error("Token expired or invalid");

        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Welcome");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error("Error about the token:", data.message || "Failed to fetch tours");
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
        `https://latestservice-production.up.railway.app/api/tours/delete/${selectedTour.tour_id}`,
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
    navigation.navigate("Tour", {
      tourId: selectedTour.tour_id || null,
      tourName: selectedTour.tour_name || "",
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
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
                    placeholder={`+ Experiential/Immersive Walk`}
                    placeholderTextColor="#9095A1"
                    value={tour.tour_name}
                    onChangeText={(text) => handleInputChange(text, index)}
                    editable={false}
                    multiline={true}
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
              Are you sure you want to delete Experimental Tour/Walk {selectedTourIndex + 1}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleDelete}>
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isContactUsModalVisible}
        onRequestClose={handleContactUsClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Contact Us</Text>
            <Text style={styles.modalText}>Email: contact@thestorye.in</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleContactUsClose}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isLogoutModalVisible}
        onRequestClose={handleLogoutClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalText}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleLogoutClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleLogout}>
                <Text style={styles.confirmButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent dark overlay
          },
          draggableIcon: {
            backgroundColor: '#555', // Softer contrast
            width: 50, // Makes it more visible
            height: 5,
            borderRadius: 3,
            marginVertical: 5,
          },
          container: {
            borderTopLeftRadius: 25, // More rounded corners
            borderTopRightRadius: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // Softer, more modern transparency
            backdropFilter: 'blur(15px)', // Enhances glassy effect
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: -3 },
            shadowRadius: 12,
            paddingHorizontal: 15, // Better spacing inside
            paddingBottom: 20,
          },
        }}
      >
        <View style={styles.bottomSheet}>
          <TouchableOpacity style={styles.closeButton} onPress={() => refRBSheet.current.close()}>
            <Icon name="close" size={28} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomSheetItem} onPress={() => handleMenuItemPress("Contact Us")}>
            <Icon name="mail" size={20} color="#333" style={styles.bottomSheetIcon} />
            <Text style={styles.bottomSheetText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomSheetItem} onPress={() => handleMenuItemPress("Log Out")}>
            <Icon name="logout" size={20} color="#333" style={styles.bottomSheetIcon} />
            <Text style={styles.bottomSheetText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#DE3B40',
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
  popupCard: {
    position: 'absolute',
    top: height * 0.1,
    right: width * 0.05,
    width: width * 0.6,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 20,
    zIndex: 1000,
  },
  popupMenuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  popupMenuText: {
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
    fontWeight: '700',
    fontSize: width * 0.05,
    textAlign: 'center',
  },
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
    alignContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#DE3B40',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: 'white',
  },
  confirmButton: {
    backgroundColor: '#DE3B40',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    fontWeight: '600',
    color: '#FFF',
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Lighter & more modern
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bottomSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Subtle separator
  },
  bottomSheetIcon: {
    marginRight: 10,
  },
  bottomSheetText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
});