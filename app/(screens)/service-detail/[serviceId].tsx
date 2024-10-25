import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { GET_SERVICES_BY_ID } from "@/store/apps/services";
import {
  MaterialIcons,
  AntDesign,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { GET_REVIEWS, GetReviewData } from "@/store/apps/review";

const { width } = Dimensions.get("window");
const imageHeight = (width * 9) / 16;

const ServiceDetail: React.FC = () => {
  const { serviceId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  let serviceID = 0;
  if (typeof serviceId === "string") serviceID = parseInt(serviceId);

  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false); // New state for contact modal
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (serviceID) {
      dispatch(GET_SERVICES_BY_ID(serviceID));
    }
  }, [serviceID]);

  useEffect(() => {
    if (serviceID) {
      dispatch(GET_REVIEWS({ service_id: serviceID }));
    }
  }, [serviceID]);

  // serviceList
  const serviceData = useSelector(
    (state: RootState) => state.servicesList.servicesListParticular.data
  );
  const loading = useSelector(
    (state: RootState) => state.servicesList.servicesListParticular.loading
  );
  const error = useSelector(
    (state: RootState) => state.servicesList.servicesListParticular.error
  );

  // all service data
  const allServices = useSelector(
    (state: RootState) => state.servicesList.serviceList.data
  );

  const relatedServices = allServices.filter(
    (service) =>
      service.category === serviceData.category &&
      service.service_id !== serviceID
  );

  // Reviews
  const reviewData = useSelector(
    (state: RootState) => state.review.review.data
  );
  const reviewLoading = useSelector(
    (state: RootState) => state.review.review.loading
  );
  const reviewError = useSelector(
    (state: RootState) => state.review.review.error
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error || !serviceData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load service details. Please try again later.
        </Text>
      </View>
    );
  }

  const openImagePopup = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeImagePopup = () => {
    setModalVisible(false);
    setSelectedImage("");
  };

  const openContactPopup = () => {
    setContactModalVisible(true); // Show contact modal
  };

  const closeContactPopup = () => {
    setContactModalVisible(false); // Hide contact modal
  };

  const calculateAverageRating = (reviews: GetReviewData[]) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce(
      (sum, review) => sum + Number(review.rating),
      0
    );
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(reviewData);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWhatsApp = (phoneNumber) => {
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Carousel */}
      <FlatList
        data={serviceData.image_urls}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openImagePopup(item)}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
        pagingEnabled
      />

      {/* Service Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.serviceName}>{serviceData.name}</Text>
        <Text style={styles.serviceCategory}>
          Category: {serviceData.category}
        </Text>
        <Text style={styles.servicePrice}>${serviceData.price}</Text>

        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={18} color="#FFD700" />
          <Text style={styles.ratingText}>
            {averageRating} {`(${reviewData.length})`}
          </Text>
        </View>

        <Text style={styles.serviceDescription}>{serviceData.description}</Text>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: 16,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#007BFF",
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 5,
              width: "100%",
            }}
            onPress={openContactPopup} // Open contact popup
          >
            <Text
              style={{ color: "#FFFFFF", fontSize: 16, textAlign: "center" }}
            >
              View Contact
            </Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 8, color: "#007BFF", textAlign: "right" }}>
            Report this ad?
          </Text>
        </View>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsSection}>
        <View style={styles.reviewTitle}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <TouchableOpacity
            style={styles.addReviewButton}
            onPress={() => router.push(`(screens)/addReview/${serviceID}`)}
          >
            <Text style={styles.addReviewText}>Add a review</Text>
          </TouchableOpacity>
        </View>

        {reviewData.length > 0 ? (
          reviewData.map((review) => (
            <View key={review.review_id} style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <FontAwesome name="user-circle" size={24} color="#007BFF" />
                <Text style={styles.username}>{"John doe"}</Text>
              </View>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                  <AntDesign
                    key={index}
                    name={index < Number(review.rating) ? "star" : "staro"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.reviewText}>{review.review_text}</Text>
              <FlatList
                data={review.image_urls}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => openImagePopup(item)}>
                    <Image source={{ uri: item }} style={styles.reviewImage} />
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          ))
        ) : (
          <Text style={styles.noReviewText}>No reviews available.</Text>
        )}
      </View>

      {/* Related Services Section */}
      <View style={styles.relatedServicesSection}>
        <Text style={styles.sectionTitle}>Related Services</Text>
        <FlatList
          data={relatedServices}
          horizontal
          keyExtractor={(item) => item.service_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.relatedServiceCard}
              onPress={() =>
                router.push(`(screens)/service-detail/${item.service_id}`)
              }
            >
              {item.image_urls && item.image_urls.length > 0 ? (
                <Image
                  source={{ uri: item.image_urls[0] }}
                  style={styles.relatedServiceImage}
                  resizeMode="cover"
                />
              ) : (
                <View />
              )}
              <Text style={styles.relatedServiceName}>{item.name}</Text>
              <Text style={styles.relatedServicePrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Modal for displaying the image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeImagePopup}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <Pressable style={styles.closeButton} onPress={closeImagePopup}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for displaying contact details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={closeContactPopup}
      >
        <View style={styles.modalContainerContact}>
          <View style={styles.modalContentContact}>
            <Text style={styles.contactTitle}>Contact Details</Text>
            <View style={styles.contactItem}>
              <Pressable onPress={() => handleCall("+91 8072873118")} style={styles.contactClick}>
                <Ionicons name="call-outline" size={24} color="blue" />
                <Text style={styles.contactText}> {"8072873118"}</Text>
              </Pressable>
            </View>
            <View style={styles.contactItem}>
              <Pressable onPress={() => handleEmail("testmail@gmail.com")} style={styles.contactClick}>
                <Ionicons name="mail-outline" size={24} color="red" />
                <Text style={styles.contactText}> {"testmail@gmail.com"}</Text>
              </Pressable>
            </View>
            <View style={styles.contactItem}>
              <Pressable onPress={() => handleWhatsApp("+91 8072873118")} style={styles.contactClick}>
                <Ionicons name="logo-whatsapp" size={24} color="green" />
                <Text style={styles.contactText}> {"8072873118"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 2,
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginVertical: 5,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin : 10
  },
  contactClick : {
    flexDirection: "row",
    alignItems: "center",
    width : '100%'
  },

  modalContainerContact: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentContact: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "flex-start",
  },
  addReviewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007BFF",
    borderRadius: 6,
    margin: 10,
  },
  addReviewText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  noReviewText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginVertical: 20,
  },

  reviewTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  image: {
    width: width,
    height: imageHeight,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  serviceCategory: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#888",
  },
  serviceDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewsSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    margin: 10,
  },
  reviewContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 4,
  },
  relatedServicesSection: {
    width: "100%",
    marginVertical: 16,
  },
  relatedServiceCard: {
    width: 150,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  relatedServiceImage: {
    width: "100%",
    height: 80,
    resizeMode: "stretch",
    borderRadius: 4,
    marginBottom: 8,
  },
  relatedServiceName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  relatedServicePrice: {
    fontSize: 14,
    color: "#007BFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "contain",
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ServiceDetail;
