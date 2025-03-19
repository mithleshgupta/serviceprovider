import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';

const CategoryDropdown = ({ onSelect }) => {
    const [selectedCategory, setSelectedCategory] = useState('Select Category');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const categories = [
        { id: '1', title: 'Food Walk' },
        { id: '2', title: 'Heritage Walk' },
        { id: '3', title: 'City Walk' },
        { id: '4', title: 'Cultural Walk' },
        { id: '5', title: 'Museum Tour' },
        { id: '6', title: 'Bike/Cycle Tour' },
        { id: '7', title: 'Sightseeing' },
        { id: '8', title: 'Trekking' },
        { id: '9', title: 'Craft Walk' },
        { id: '10', title: 'Artisan Walk' },
    ];

    const handleSelect = (category) => {
        setSelectedCategory(category.title);
        setDropdownVisible(false);
        onSelect(category.id);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownVisible(true)}
            >
                <Text style={styles.dropdownButtonText}>{selectedCategory}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            <Modal
                isVisible={dropdownVisible}
                onBackdropPress={() => setDropdownVisible(false)}
                style={styles.bottomModal}
            >
                <View style={styles.modalContent}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.dropdownOptionText}>{item.title}</Text>
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
        marginVertical: 5,
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
        textAlign: "center",
    },
});

export default CategoryDropdown;
