import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        phone: 'Not provided'
    });

    const handleSignOut = () => {
        // Handle sign out logic here
        router.replace('/auth/login');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <MaterialIcons name="person" size={60} color="#0A3D3F" />
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialIcons name="edit" size={18} color="#0A3D3F" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email || ''}</Text>
            </View>

            <View style={styles.menuContainer}>
                <MenuItem 
                    icon="person-outline" 
                    title="Personal Information" 
                    onPress={() => {}}
                />
                <MenuItem 
                    icon="card-travel" 
                    title="My Bookings" 
                    onPress={() => {}}
                />
                <MenuItem 
                    icon="notifications-none" 
                    title="Notifications" 
                    onPress={() => {}}
                />
                <MenuItem 
                    icon="settings" 
                    title="Settings" 
                    onPress={() => {}}
                />
                <MenuItem 
                    icon="help-outline" 
                    title="Help & Support" 
                    onPress={() => {}}
                />
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
                <MaterialIcons name="logout" size={20} color="#E74C3C" />
            </TouchableOpacity>

            <Text style={styles.versionText}>Flight Finder v1.0.0</Text>
        </ScrollView>
    );
};

const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            <MaterialIcons name={icon} size={24} color="#0A3D3F" />
            <Text style={styles.menuItemText}>{title}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
);

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0A3D3F',
        textAlign: 'center',
    },
    profileSection: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E8F4F4',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#0A3D3F',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
        borderWidth: 2,
        borderColor: '#0A3D3F',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0A3D3F',
        marginTop: 8,
    },
    userEmail: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        margin: 16,
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: '#1F2937',
        marginLeft: 16,
    },
    signOutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    signOutText: {
        color: '#E74C3C',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    versionText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 20,
    },
});