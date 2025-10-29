import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Sample booking data
const bookingsData = [
    {
        id: '1',
        airline: 'SkyWings',
        flightNumber: 'SW 785',
        departure: {
            city: 'New York',
            code: 'JFK',
            time: '08:30',
            date: '15 NOV 2023',
        },
        arrival: {
            city: 'London',
            code: 'LHR',
            time: '20:45',
            date: '15 NOV 2023',
        },
        duration: '7h 15m',
        price: 450,
        status: 'Confirmed',
        passengers: 1,
        bookingDate: '10 NOV 2023',
        bookingNumber: 'BK78945612',
    },
    {
        id: '2',
        airline: 'Oceanic',
        flightNumber: 'OA 245',
        departure: {
            city: 'London',
            code: 'LHR',
            time: '14:15',
            date: '22 NOV 2023',
        },
        arrival: {
            city: 'New York',
            code: 'JFK',
            time: '17:30',
            date: '22 NOV 2023',
        },
        duration: '8h 15m',
        price: 520,
        status: 'Confirmed',
        passengers: 1,
        bookingDate: '05 NOV 2023',
        bookingNumber: 'BK45612378',
    },
];

const BookingCard = ({ booking }) => {
    const { airline, flightNumber, departure, arrival, duration, price, status, bookingNumber } = booking;

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.airlineContainer}>
                    <View style={styles.airlineLogo}>
                        <MaterialIcons name="flight" size={24} color="#0E2A47" />
                    </View>
                    <View>
                        <Text style={styles.airlineName}>{airline}</Text>
                        <Text style={styles.flightNumber}>{flightNumber}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status === 'Confirmed' ? '#D1FAE5' : '#FEE2E2' }]}>
                    <Text style={[styles.statusText, { color: status === 'Confirmed' ? '#065F46' : '#B91C1C' }]}>
                        {status}
                    </Text>
                </View>
            </View>

            <View style={styles.flightInfo}>
                <View style={styles.locationContainer}>
                    <Text style={styles.time}>{departure.time}</Text>
                    <Text style={styles.city}>{departure.city}</Text>
                    <Text style={styles.airportCode}>{departure.code}</Text>
                    <Text style={styles.date}>{departure.date}</Text>
                </View>

                <View style={styles.durationContainer}>
                    <View style={styles.durationLine}>
                        <View style={styles.durationDot} />
                        <View style={styles.durationLineMiddle} />
                        <MaterialIcons name="flight" size={20} color="#6B7280" style={styles.flightIcon} />
                        <View style={styles.durationLineMiddle} />
                        <View style={styles.durationDot} />
                    </View>
                    <Text style={styles.durationText}>{duration}</Text>
                </View>

                <View style={[styles.locationContainer, { alignItems: 'flex-end' }]}>
                    <Text style={styles.time}>{arrival.time}</Text>
                    <Text style={styles.city}>{arrival.city}</Text>
                    <Text style={styles.airportCode}>{arrival.code}</Text>
                    <Text style={styles.date}>{arrival.date}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerLabel}>Booking Number</Text>
                    <Text style={styles.footerValue}>{bookingNumber}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${price}</Text>
                    <Text style={styles.perPerson}>per person</Text>
                </View>
            </View>
        </View>
    );
};

const Bookings = () => {
    const router = useRouter();

    return (

        <View style={styles.container}>
            <StatusBar backgroundColor="#ffffffff" barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Bookings</Text>
            </View>

            {bookingsData.length > 0 ? (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    {bookingsData.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="airplanemode-inactive" size={64} color="#9CA3AF" />
                    <Text style={styles.emptyTitle}>No Bookings Yet</Text>
                    <Text style={styles.emptyText}>Your upcoming flight bookings will appear here</Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.exploreButtonText}>Explore Flights</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Bookings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        top: 40,
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0E2A47',
        textAlign: 'center',
        marginTop: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    airlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    airlineLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F4F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    airlineName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    flightNumber: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    flightInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    locationContainer: {
        flex: 1,
    },
    time: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0E2A47',
        marginBottom: 4,
    },
    city: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    airportCode: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    durationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        minWidth: 100,
    },
    durationLine: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 4,
    },
    durationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#9CA3AF',
    },
    durationLineMiddle: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 4,
    },
    flightIcon: {
        transform: [{ rotate: '90deg' }],
        marginHorizontal: 4,
    },
    durationText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    footerValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0E2A47',
    },
    perPerson: {
        fontSize: 12,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    exploreButton: {
        backgroundColor: '#0E2A47',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    exploreButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});