import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
} from 'react-native';

const SelectCity = ({ onSelect }) => {
    const [selectedCity, setselectedCity] = useState('Select City');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const cities = ['Delhi', 'Mumbai', 'Kolkata'];

    const handleSelect = (category) => {
        setselectedCity(category);
        setDropdownVisible(false);
        onSelect(category); 
    };

    return (
        <View style={styles.container}>
            
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownVisible(!dropdownVisible)}
            >
                <Text style={styles.dropdownButtonText}>{selectedCity}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            
            {dropdownVisible && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={cities}
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

export default SelectCity;
