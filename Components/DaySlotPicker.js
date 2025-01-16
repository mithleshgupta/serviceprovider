import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DaySlotPicker = ({ day, timeRanges, onUpdate, onRemove }) => {

    const [currentSlot, setCurrentSlot] = useState({ start: '', end: '' });
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [currentTimeType, setCurrentTimeType] = useState('start');

    const showTimePicker = (type) => {
        setCurrentTimeType(type);
        setPickerVisible(true);
    };

    const hideTimePicker = () => setPickerVisible(false);

    const handleTimeConfirm = (time) => {
        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCurrentSlot({
            ...currentSlot,
            [currentTimeType]: formattedTime,
        });
        hideTimePicker();
    };

    const addTimeRange = () => {
        if (currentSlot.start && currentSlot.end) {
            onUpdate([...timeRanges, currentSlot]);
            setCurrentSlot({ start: '', end: '' });
        }
    };

    const removeTimeRange = (index) => {
        onUpdate(timeRanges.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dayText}>{day}</Text>
                <TouchableOpacity onPress={onRemove}>
                    <Text style={styles.removeDay}>✖</Text>
                </TouchableOpacity>
            </View>

            {timeRanges.map((range, index) => (
                <View key={index} style={styles.timeRangeRow}>
                    <Text>{range.start} - {range.end}</Text>
                    <TouchableOpacity onPress={() => removeTimeRange(index)}>
                        <Text style={styles.removeRange}>✖</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <View style={styles.timeInputRow}>
                <TouchableOpacity onPress={() => showTimePicker('start')} style={styles.timeButton}>
                    <Text>{currentSlot.start || 'Start Time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showTimePicker('end')} style={styles.timeButton}>
                    <Text>{currentSlot.end || 'End Time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addTimeRange} style={styles.addTimeButton}>
                    <Text style={styles.addTimeText}>+ Add Slot</Text>
                </TouchableOpacity>
            </View>

            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeDay: {
        color: 'red',
        fontSize: 18,
    },
    timeRangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 8

    },
    removeRange: {
        color: 'red',
        marginLeft: 10,
    },
    timeInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    timeButton: {
        backgroundColor: '#e0e0e0',
        padding: 8,
        borderRadius: 5,
        marginRight: 10,
        flex: 1,
        alignItems: 'center',
    },
    addTimeButton: {
        backgroundColor: '#4caf50',
        padding: 8,
        borderRadius: 5,
    },
    addTimeText: {
        color: '#fff',
    },
});

export default DaySlotPicker;
