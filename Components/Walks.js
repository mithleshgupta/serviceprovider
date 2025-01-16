import { useNavigation } from '@react-navigation/native';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', title: 'Food Tour/Walk', image: require('../assets/Foodwalk.png') },
  { id: '2', title: 'Heritage Tour/Walk', image: require('../assets/Heritagewalk.png') },
  { id: '3', title: 'City Tour/Walk', image: require('../assets/CityTour.png') },
  { id: '4', title: 'Cultural Tour/Walk', image: require('../assets/CulturalWalk.png') },
  { id: '5', title: 'Auroville Tour/Walk', image: require('../assets/Kolkata.png') },
];

const sliderImages = [
  require('../assets/JamaMasjid.png'),
  require('../assets/Chennai.png'),
  require('../assets/Mumbai.png'),
];

export default function Walks() {
  const navigation = useNavigation();

  const handleCategoryPress = (id, title) => {
   
    navigation.navigate('WalkList', { categoryId: id, categoryTitle: title });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item.id, item.title)} 
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Text style={styles.header}>Pondicherry</Text>

      {/* Swiper Section */}
      <View style={styles.sliderContainer}>
        <Swiper autoplay showsPagination>
          {sliderImages.map((image, index) => (
            <View key={index} style={styles.sliderItem}>
              <Image source={image} style={styles.sliderImage} />
            </View>
          ))}
        </Swiper>
      </View>

      {/* Categories Section */}
      <Text style={styles.subHeader}>Explore Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.categoryList}
        ListEmptyComponent={<Text style={styles.emptyText}>No categories available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'left',
    margin: 16,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  sliderItem: {
    flex: 1,
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    maxWidth: width / 2 - 24,
  },
  categoryImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  categoryTitle: {
    textAlign: 'center',
    fontWeight: '500',
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
    color: '#888',
  },
});
