import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { ADD_SERVICE } from '@/store/apps/services'; // Assuming you have an action to add services
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { AppDispatch } from '@/store';
import { REVERSE_GEO_TRACK } from '@/store/apps/reverseGeo';
import { Picker } from '@react-native-picker/picker'; // Picker for category selection

const AddService = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();

    // Function to get user's location
    const getUserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            const userLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: userLocation.coords.latitude.toString(),
                longitude: userLocation.coords.longitude.toString(),
            });
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    const handleImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
            selectionLimit: 0,
        });

        if (!result.canceled) {
            // Concatenate existing images with newly selected ones
            const newImages = result.assets.map(asset => asset.uri);
            setImages([...images, ...newImages]);
        }
    };

    const handleSubmit = async () => {
        if (!name || !description || !price || images.length === 0 || !category) {
            alert('Please fill all fields');
            return;
        }

        const serviceData = {
            name,
            description,
            latitude: location.latitude,
            longitude: location.longitude,
            city,
            price,
            category, // Add category to the serviceData
            image_urls: images,
        };

        console.log('Service Data:', serviceData);

        // Dispatch action to add service
        await dispatch(ADD_SERVICE({ serviceData }));

        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setCategory(''); // Reset category
        setImages([]); // Reset images
        alert('Service added successfully!');
    };


    useEffect(() => {
        if (location.latitude && location.longitude) {
            dispatch(REVERSE_GEO_TRACK({ lat: Number(location.latitude), lon: Number(location.longitude) }))
                .then((res) => {
                    const fetchedCity = res.payload?.address?.city;
                    if (fetchedCity) {
                        setCity(fetchedCity); // Set the fetched city to the TextInput
                    } else {
                        console.error('City not found in response');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching city:', error);
                });
        }
    }, [location]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Add New Service</Text>

            <TextInput
                style={styles.input}
                placeholder="Service Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            <TextInput
                style={styles.input}
                placeholder="Location (Lat, Long)"
                value={`Lat: ${location.latitude}, Long: ${location.longitude}`}
                editable={false} // Make it read-only
            />

            <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
                editable={false} 
            />

            <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />

            {/* Category picker */}
            <Picker
                selectedValue={category}
                style={styles.input}
                onValueChange={(itemValue) => setCategory(itemValue)}
            >
                <Picker.Item label="Select Category" value="" />
                <Picker.Item label="Cleaning" value="cleaning" />
                <Picker.Item label="Plumbing" value="plumbing" />
                <Picker.Item label="Electrical" value="electrical" />
                <Picker.Item label="Teaching" value="teaching" />
                <Picker.Item label="Painting" value="painting" />
                {/* Add more categories as needed */}
            </Picker>

            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                {images.length > 0 ? (
                    <Text style={styles.imageText}>Images Selected: {images.length}</Text>
                ) : (
                    <Text style={styles.imageText}>Select Images</Text>
                )}
            </TouchableOpacity>

            {images.length > 0 && (
                <View style={styles.imagePreview}>
                    {images.map((imageUri, index) => (
                        <Image key={index} source={{ uri: imageUri }} style={styles.image} />
                    ))}
                </View>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={city === ''}>
                <Text style={styles.submitButtonText}>Add Service</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddService;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    imagePicker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 15,
    },
    imageText: {
        fontSize: 16,
    },
    imagePreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
    },
});
