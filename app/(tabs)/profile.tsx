import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { logout } from '@/authService';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
    const {user} = useAuth()
    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/login');
            console.log('User successfully logged out');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleAddService = () => {
        router.push('/add-service');
    };

    return (
        <View style={styles.container}>
            {/* Profile Header Section */}
            <View style={styles.profileHeader}>
                <Image
                    source={{ uri: 'https://dummyimage.com/100x100/007BFF/ffffff&text=User' }}
                    style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.displayName}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Profile Fields */}
            <View style={styles.profileFields}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="+1 234 567 8901"
                    placeholderTextColor="#aaa"
                />
                <Text style={styles.fieldLabel}>Address</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="123 Main St, City, Country"
                    placeholderTextColor="#aaa"
                />
                <Text style={styles.fieldLabel}>Bio</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Tell us about yourself"
                    placeholderTextColor="#aaa"
                    multiline
                    numberOfLines={3}
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={handleAddService}>
                    <Text style={styles.optionButtonText}>Add Service</Text>
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        padding: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 24,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#777',
    },
    editButton: {
        marginTop: 8,
        backgroundColor: '#007BFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    profileFields: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    inputField: {
        height: 40,
        borderColor: '#CED4DA', 
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        backgroundColor: '#F1F3F5',
    },
    optionsContainer: {
        marginBottom: 24,
    },
    optionButton: {
        backgroundColor: '#6C757D', 
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    optionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#DC3545',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
