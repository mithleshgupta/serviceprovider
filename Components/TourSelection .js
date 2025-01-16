import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const TourSelection = ({ onSelect }) => {
    const [selectedTour, setSelectedTour] = useState(null);

    const tourOptions = [
        { id: 1, label: 'Food Tour/Walk', value: 'food' },
        { id: 2, label: 'Heritage Tour/Walk', value: 'heritage' },
        { id: 3, label: 'City Tour/Walk', value: 'city' },
        { id: 4, label: 'Cultural Tour/Walk', value: 'cultural' },
        { id: 5, label: 'Auroville Tour/Walk', value: 'auroville' },
    ];

    const handleSelect = (value) => {
        const selectedOption = tourOptions.find((option) => option.value === value);
        if (selectedOption) {
            setSelectedTour(selectedOption.id);
            onSelect(selectedOption.id);
        } else {
            setSelectedTour(null);
            onSelect(null);
        }
    };

    return (
        <View style={styles.container}>
            <RNPickerSelect
                onValueChange={handleSelect}
                items={tourOptions.map(({ label, value }) => ({ label, value }))}
                style={{
                    inputIOS: {
                        ...styles.pickerInput,
                        color: selectedTour ? '#000' : '#888', // Text color for selected and placeholder
                    },
                    inputAndroid: {
                        ...styles.pickerInput,
                        color: selectedTour ? '#000' : '#888', // Text color for selected and placeholder
                    },
                    placeholder: {
                        color: '#888', // Placeholder text color
                    },
                    iconContainer: {
                        top: 10,
                        right: 12,
                    },
                }}
                placeholder={{ label: 'Select a Tour/Walk', value: null }}
                value={tourOptions.find((option) => option.id === selectedTour)?.value || null}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    pickerInput: {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
});

export default TourSelection;
