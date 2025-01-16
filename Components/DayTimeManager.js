import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import DaySlotPicker from './DaySlotPicker';
import { Picker } from '@react-native-picker/picker';

const DayTimeManager = ({ daysData, setDaysData }) => {

    const [selectedDay, setSelectedDay] = useState('');

    const addDay = () => {
        if (selectedDay && !daysData.some((d) => d.day === selectedDay)) {
            setDaysData([...daysData, { day: selectedDay, timeRanges: [] }]);
            setSelectedDay('');
        }
    };

    const removeDay = (day) => {
        setDaysData(daysData.filter((d) => d.day !== day));
    };

    const updateTimeRanges = (day, timeRanges) => {
        setDaysData(
            daysData.map((d) => (d.day === day ? { ...d, timeRanges } : d))
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
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
            </View>

            <ScrollView>
                {daysData.map((dayObj) => (
                    <DaySlotPicker
                        key={dayObj.day}
                        day={dayObj.day}
                        timeRanges={dayObj.timeRanges}
                        onUpdate={(timeRanges) => updateTimeRanges(dayObj.day, timeRanges)}
                        onRemove={() => removeDay(dayObj.day)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white'
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
        borderRadius: 30,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
        elevation: 1,

    },
    picker: {
        height: 55,
        lineHeight: 30,
        color: '#333',

    },
    addButton: {
        backgroundColor: '#DE3B40',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 40,
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




export default DayTimeManager;
