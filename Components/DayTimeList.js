import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import DayTimePicker from './TimeSlotPicker ';

const DayTimeList = () => {
    const [dayTimeSlots, setDayTimeSlots] = useState([{ id: Date.now() }]);

    const addDayTimeSlot = () => {
        setDayTimeSlots([...dayTimeSlots, { id: Date.now() }]);
    };

    const removeDayTimeSlot = (id) => {
        setDayTimeSlots(dayTimeSlots.filter((slot) => slot.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Day and Time Slots</Text>
            <ScrollView>
                {dayTimeSlots.map((slot) => (
                    <DayTimePicker
                        key={slot.id}
                        onRemove={() => removeDayTimeSlot(slot.id)}
                    />
                ))}
            </ScrollView>
            {/* Add Button */}
            <TouchableOpacity onPress={addDayTimeSlot} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Slot</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addButton: {
        marginTop: 10,
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default DayTimeList;
