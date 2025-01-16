import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DayTimePicker = ({ onRemove }) => {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);

    const showTimePicker = () => setTimePickerVisible(true);
    const hideTimePicker = () => setTimePickerVisible(false);

    const handleTimeConfirm = (time) => {
        setSelectedTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        hideTimePicker();
    };

    return (
        <View style={styles.row}>
            {/* Day Dropdown */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedDay}
                    onValueChange={(itemValue) => setSelectedDay(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Day" value="" />
                    <Picker.Item label="Monday" value="Monday" />
                    <Picker.Item label="Tuesday" value="Tuesday" />
                    <Picker.Item label="Saturday" value="Saturday" />
                </Picker>
            </View>
            <TouchableOpacity onPress={addDay} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Day</Text>
            </TouchableOpacity>

            {/* Time Picker */}
            <TouchableOpacity onPress={showTimePicker} style={styles.timeButton}>
                <Text style={styles.timeText}>
                    {selectedTime || 'Select Time'}
                </Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <Text style={styles.removeText}>✖</Text>
            </TouchableOpacity>


            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        padding: 20, 
        backgroundColor: '#f9fafc' 
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 15, 
        color: '#333' 
    },
    row: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 15 
    },
    pickerContainer: { 
        flex: 1, 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        overflow: 'hidden',
        elevation: 2,
    },
    picker: { 
        height: 50, 
        lineHeight: 50, 
        color: '#333', 
    },
    addButton: { 
        backgroundColor: '#DE3B40', 
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderRadius: 8, 
        marginLeft: 10, 
        opacity: 0.9,
        elevation: 3,
    },
    addButtonText: { 
        color: '#fff', 
        fontWeight: '600', 
        fontSize: 14 
    },
});


export default DayTimePicker;
