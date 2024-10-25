import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { GET_SERVICES } from "@/store/apps/services";
import CategoryCarousel from "@/components/CategoryCarousel";
import ServiceList from "@/components/ServiceList";
import { REVERSE_GEO_TRACK } from "@/store/apps/reverseGeo";
import * as Location from "expo-location";
import SearchService from "@/components/SearchService";
import Fuse from "fuse.js"

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [location, setLocation] = useState<{ latitude: string; longitude: string }>({ latitude: "", longitude: "" });
  const [city, setCity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state

  // Access the services data, loading, and error state
  const servicesData = useSelector((state: RootState) => state.servicesList.serviceList.data);
  const loading = useSelector((state: RootState) => state.servicesList.serviceList.loading);
  const error = useSelector((state: RootState) => state.servicesList.serviceList.error);

  // Function to get user's location
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude.toString(),
        longitude: userLocation.coords.longitude.toString(),
      });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    getUserLocation(); // Fetch location when the component mounts
  }, []);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setRefreshing(true);
    dispatch(GET_SERVICES()).finally(() => {
      setRefreshing(false);
    });
  };

  const reverse = async (lat: number, long: number) => {
    try {
      const response = await dispatch(
        REVERSE_GEO_TRACK({ lat, lon: long })
      );

      if (
        response.payload &&
        response.payload.address &&
        response.payload.address.city
      ) {
        console.log("city", response.payload.address.city);
        setCity(response.payload.address.city);
      } else {
        console.log("City not found in reverse geocoding response.");
        setCity("");
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      Alert.alert("Error fetching city from reverse geocoding");
    }
  };

  useEffect(() => {
    reverse(Number(location.latitude), Number(location.longitude));
  }, [location]);

  const fuse = new Fuse(servicesData, {
    keys: ["category", "name", "description"],
    includeScore: true,
    threshold: 0.3,
  })

 const filteredServices = searchTerm ? fuse.search(searchTerm).map(result => result.item) : servicesData;

  console.log("loading", loading);

  return (
    <View style={styles.container}>
      <SearchService onSearch={setSearchTerm} />
      <CategoryCarousel />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchServices} />
        }
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading please wait </Text>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : filteredServices.length > 0 ? (
          <ServiceList
            services={filteredServices}
            userCity={city}
            loading={loading}
          />
        ) : (
          <Text style={styles.errorText}>No services available</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
