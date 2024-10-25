import { Service } from '@/store/apps/services';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

interface Servicestate {
  services: Service[];
  userCity?: string;
  loading : boolean;
}

const { width } = Dimensions.get('window');
const imageHeight = width * 9 / 16;

const ServiceList: React.FC<Servicestate> = ({ services, userCity, loading }) => {
  const navigation = useNavigation();

  console.log(loading)


  // Store current image index for each service in an object
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});

  const filteredServices = services.filter((service) => service.city === userCity);

  const handleScroll = (serviceId: string, event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndexes((prevState) => ({
      ...prevState,
      [serviceId]: index,
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {filteredServices.map((service) => (
        <View key={service.service_id} style={styles.card}>
          <View>
            <FlatList
              data={service.image_urls}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.serviceImage} />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              onScroll={(event) => handleScroll(String(service.service_id), event)}
              style={styles.carousel}
            />

            <View style={styles.imageCountContainer}>
              <Text style={styles.imageCountText}>
                {currentImageIndexes[service.service_id] !== undefined
                  ? currentImageIndexes[service.service_id] + 1
                  : 1}/{service.image_urls.length}
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceLocation}>{`${service.city}`}</Text>
            <Text style={styles.category}>{service.category}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.servicePrice}>${service.price}</Text>

            <TouchableOpacity style={styles.button} onPress={() => router.push(`(screens)/service-detail/${service.service_id}`)}>
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ServiceList;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  carousel: {
    width: width,
  },
  serviceImage: {
    width: width,
    height: imageHeight, 
    resizeMode: 'cover',
  },
  imageCountContainer: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  serviceLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
