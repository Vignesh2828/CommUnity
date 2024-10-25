import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { POST_REVIEW } from '@/store/apps/review';

const AddReview = () => {
    const { serviceId } = useLocalSearchParams();
    let serviceID = 0;
    if (typeof serviceId === 'string') serviceID = parseInt(serviceId);

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [images, setImages] = useState<string[]>([]);

    const dispatch = useDispatch<AppDispatch>();

    const handleRating = (selectedRating: any) => {
        setRating(selectedRating);
    };

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            selectionLimit: 0,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            setImages([...images, ...newImages]);
        }
    };

    const handleSubmitReview = async () => {
        console.log('Review Submitted:', { serviceID, rating, reviewText, images });
        try {
            const reviewData = {
                service_id: serviceID,
                rating: String(rating),
                review_text: reviewText,
                image_urls: images,
            };
            await dispatch(POST_REVIEW({ addReviewData: reviewData })).then(() => {
                Alert.alert("Done", "Thank you for your review ❤️");
            });
        } catch (error) {
            // Handle error
        }
    };
    const ratingMessages: { [key: number]: string } = {
        1: 'Worst ☹️',
        2: 'Not Bad 🙂',
        3: 'Good 😄',
        4: 'Best 🤩',
        5: 'Great 🤗',
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add Your Review</Text>
            <Text style={styles.subtitle}>Rate Your Experience</Text>

            {/* Rating Stars */}
            <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => handleRating(index + 1)}>
                        <AntDesign
                            name={index < rating ? 'star' : 'staro'}
                            size={32}
                            color="#FFD700"
                            style={styles.starIcon}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Displaying the Rating Description */}
            {rating > 0 && (
                <Text style={styles.ratingDescription}>
                    {ratingMessages[rating]}
                </Text>
            )}

            {/* Review Text Input */}
            <TextInput
                style={styles.reviewInput}
                placeholder="Write your review here..."
                placeholderTextColor="#aaa"
                multiline
                value={reviewText}
                onChangeText={setReviewText}
            />

            {/* Image Uploader */}
            <Text style={styles.subtitle}>Add Photos (Optional)</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                <FontAwesome name="camera" size={24} color="#007BFF" />
                <Text style={styles.imagePickerText}>Pick Images</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                {images.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.reviewImage} />
                ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
                <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddReview;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        flexGrow: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginVertical: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    starIcon: {
        marginHorizontal: 5,
    },
    ratingDescription: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        margin:10,
        marginTop: 10,
    },
    reviewInput: {
        width: '100%',
        height: 100,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    imagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#e0f0ff',
        borderRadius: 8,
        marginVertical: 10,
    },
    imagePickerText: {
        fontSize: 16,
        color: '#007BFF',
        marginLeft: 8,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    reviewImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        margin: 5,
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});
