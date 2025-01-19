import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
} from 'react-native';

const CategoryDropdown = ({ onSelect }) => {
    const [selectedCategory, setSelectedCategory] = useState('Select Category');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const categories = ['Culture', 'Heritage', 'Food'];

    const handleSelect = (category) => {
        setSelectedCategory(category);
        setDropdownVisible(false);
        onSelect(category); 
    };

    return (
        <View style={styles.container}>
            
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownVisible(!dropdownVisible)}
            >
                <Text style={styles.dropdownButtonText}>{selectedCategory}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            
            {dropdownVisible && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.dropdownOptionText}>{item}</Text>
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
        color: '#333',
    },
    dropdownIcon: {
        fontSize: 18,
        color: '#FF5E5E',
        marginHorizontal:10 
    },
    dropdown: {
        
        borderColor: '#ccc',
        
        marginTop: 5,
        backgroundColor: '#fff',
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
    },
});

export default CategoryDropdown;
