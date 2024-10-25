import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { GET_SERVICES, GET_SERVICES_BY_CATEGORY } from "@/store/apps/services";
import ServiceList from "@/components/ServiceList";
import * as Location from "expo-location";
import { REVERSE_GEO_TRACK } from "@/store/apps/reverseGeo";
import SearchService from "@/components/SearchService"; // Import SearchService
import Fuse from "fuse.js"; // Import Fuse.js

const CategoryShow = () => {
  const { category } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [city, setCity] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    if (category) {
      dispatch(GET_SERVICES_BY_CATEGORY(String(category)));
    }
  }, [category]);

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
    getUserLocation();
  }, []);

  const categoriesServices = useSelector(
    (state: RootState) => state.servicesList.serviceListCategory.data
  );
  const loading = useSelector(
    (state: RootState) => state.servicesList.serviceListCategory.loading
  );
  const error = useSelector(
    (state: RootState) => state.servicesList.serviceListCategory.error
  );

  // Function to fetch services
  const fetchServices = () => {
    setRefreshing(true);
    dispatch(GET_SERVICES()).then(() => setRefreshing(false));
  };

  const reverse = async (lat: number, long: number) => {
    try {
      const response = await dispatch(
        REVERSE_GEO_TRACK({ lat: lat, lon: long })
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

  const fuse = new Fuse(categoriesServices, {
    keys: ["category", "name", "description"], 
    includeScore: true,
    threshold: 0.3,
  });

  const filteredServices = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : categoriesServices;

  return (
    <View style={styles.container}>
      <SearchService onSearch={setSearchTerm} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchServices} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : filteredServices.length === 0 ? (
          <Text style={styles.noServicesText}>
            No services available in this category.
          </Text>
        ) : (
          <ServiceList
            services={filteredServices}
            userCity={city}
            loading={loading}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default CategoryShow;

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
    color: "red",
    marginTop: 20,
  },
  noServicesText: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginTop: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
