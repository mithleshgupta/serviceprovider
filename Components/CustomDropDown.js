import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';

const CustomDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const data = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setIsDropdownOpen(false);
    };

    return (
        <View style={styles.container}>
            {/* Dropdown Button */}
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                <Text style={styles.dropdownButtonText}>
                    {selectedItem || 'Select an option'}
                </Text>
            </TouchableOpacity>

            {/* Dropdown Options */}
            {isDropdownOpen && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => handleItemPress(item)}
                            >
                                <Text style={styles.dropdownItemText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    dropdownButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
    },
    dropdown: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        maxHeight: 150,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default CustomDropdown;
