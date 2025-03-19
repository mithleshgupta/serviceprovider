import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';

const SelectCity = ({ onSelect }) => {
    const [selectedCity, setSelectedCity] = useState('Select City');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const cities = [
        { id: 1, name: 'Agra' },
        { id: 2, name: 'Amritsar' },
        { id: 3, name: 'Bangalore' },
        { id: 4, name: 'Bhopal' },
        { id: 5, name: 'Chennai' },
        { id: 6, name: 'Delhi' },
        { id: 7, name: 'Goa' },
        { id: 8, name: 'Hyderabad' },
        { id: 9, name: 'Jaipur' },
        { id: 10, name: 'Kashmir' },
        { id: 11, name: 'Kochi' },
        { id: 12, name: 'Kolkata' },
        { id: 13, name: 'Ladakh' },
        { id: 14, name: 'Lucknow' },
        { id: 15, name: 'Manali' },
        { id: 16, name: 'Mumbai' },
        { id: 17, name: 'Pondicherry' },
        { id: 18, name: 'Rishikesh' },
        { id: 19, name: 'Shimla' },
        { id: 20, name: 'Udaipur' },
        { id: 21, name: 'Varanasi' },
    ];

    const handleSelect = (city) => {
        setSelectedCity(city.name);
        setDropdownVisible(false);
        onSelect(city.id);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownVisible(true)}
            >
                <Text style={styles.dropdownButtonText}>{selectedCity}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            <Modal
                isVisible={dropdownVisible}
                onBackdropPress={() => setDropdownVisible(false)}
                style={styles.bottomModal}
            >
                <View style={styles.modalContent}>
                    <FlatList
                        data={cities}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.dropdownOptionText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 1,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    dropdownButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: '#333',
    },
    dropdownIcon: {
        fontSize: 18,
        color: '#FF5E5E',
        marginHorizontal: 10
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderTopLeftRadius: 17,
        borderTopRightRadius: 17,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        maxHeight: '70%',
    },
    dropdownOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownOptionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});

export default SelectCity;
