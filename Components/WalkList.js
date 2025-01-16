import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function WalkList() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { categoryId, categoryTitle } = route.params;
    const [tourid, setTourId] = useState('');
    const navigation = useNavigation();
    const [tourName, setTourName] = useState('');

    console.log("this is cateofy name", categoryTitle)

    function handleNavigation() {
        navigation.navigate("ListTour", { tourId: tourid })
    }

    useEffect(() => {


        const fetchTours = async () => {
            try {
                const response = await fetch(`https://f268-103-57-87-169.ngrok-free.app/api/tours/tours/category/${categoryId}`);
                const data = await response.json();


                setTours(data.tours);

                if (data.tours.length > 0) {
                    setTourId(data.tours[0].tour_id);
                }


                setTourName(data.tours[0].tour_name);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tours:", error);
                setLoading(false);
            }
        };

        fetchTours();
    }, [categoryId]);

    const renderTourItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={handleNavigation}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{tourName}</Text>

            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#D32F2F" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{categoryTitle}</Text>
            <FlatList
                data={tours}
                renderItem={renderTourItem}
                keyExtractor={(item) => item.tour_id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No tours available</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#D32F2F',
        marginVertical: 16,
        textAlign: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 12,
        elevation: 3,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 350,  // Adjust card width
        alignSelf: 'center',  // Center the card in the list
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginVertical: 20,
    },
});
