import { router } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

const categories = [
  { id: '1', name: 'Cleaning', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Cleaning' },
  { id: '2', name: 'Plumbing', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Plumbing' },
  { id: '3', name: 'Electrical', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Electrician' },
  { id: '4', name: 'Gardening', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Gardening' },
  { id: '5', name: 'teaching', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=teaching' },
  { id: '6', name: 'Painting', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Painting' },
  { id: '7', name: 'Painting', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Painting' },
  { id: '8', name: 'Painting', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Painting' },
  { id: '9', name: 'Painting', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Painting' },
  { id: '10', name: 'Painting', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Painting' },
  { id: '11', name: 'Painting', imageUrl: 'https://dummyimage.com/100x100/000/fff&text=Painting' },
  
];

const CategoryCarousel = () => {
  const renderItem = ({ item }: { item: { id: string; name: string; imageUrl: string } }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => router.push(`(screens)/categoryService/${item.name}`)}>
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

export default CategoryCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  categoryItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
});
