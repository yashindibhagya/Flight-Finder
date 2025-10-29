import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/Text";
import { useUserDetail } from "../../context/UserDetailContext";
import { searchFlights as apiSearchFlights, hasRapidApiKey, searchAirports } from "../../services/flightApi";

const TabIndex = () => {
    const { userDetail } = useUserDetail();
    const router = useRouter();
    const userName = userDetail?.name?.split(" ")[0] || "Yashindi";

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departDate, setDepartDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
    const [tripType, setTripType] = useState('oneway');
    const [passengers, setPassengers] = useState(1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [upcomingFlights, setUpcomingFlights] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);

    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
    const originDebounceRef = useRef(null);
    const destinationDebounceRef = useRef(null);

    const handleOriginChange = (text) => {
        setOrigin(text);
        setShowOriginSuggestions(true);
        if (originDebounceRef.current) clearTimeout(originDebounceRef.current);
        originDebounceRef.current = setTimeout(async () => {
            try {
                const list = await searchAirports(text);
                setOriginSuggestions(list);
            } catch (e) {
                setOriginSuggestions([]);
            }
        }, 350);
    };

    const handleDestinationChange = (text) => {
        setDestination(text);
        setShowDestinationSuggestions(true);
        if (destinationDebounceRef.current) clearTimeout(destinationDebounceRef.current);
        destinationDebounceRef.current = setTimeout(async () => {
            try {
                const list = await searchAirports(text);
                setDestinationSuggestions(list);
            } catch (e) {
                setDestinationSuggestions([]);
            }
        }, 350);
    };

    const selectOriginSuggestion = (item) => {
        const label = item.suggestionTitle || `${item.title} (${item.skyId})`;
        setOrigin(label);
        setShowOriginSuggestions(false);
    };

    const selectDestinationSuggestion = (item) => {
        const label = item.suggestionTitle || `${item.title} (${item.skyId})`;
        setDestination(label);
        setShowDestinationSuggestions(false);
    };

    const fetchUpcomingFlights = async () => {
        if (isSearching) return;

        setIsLoadingBookings(true);
        try {
            const sampleBooking = {
                id: `booking_${Date.now()}`,
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
                bookingNumber: `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
            };
            setUpcomingFlights([sampleBooking]);
        } catch (error) {
            console.error('Error fetching upcoming flights:', error);
            setUpcomingFlights([]);
        } finally {
            setIsLoadingBookings(false);
        }
    };

    useEffect(() => {
        if (!isSearching) {
            fetchUpcomingFlights();
        }
    }, [isSearching]);

    const handleSearch = async () => {
        if (!origin || !destination) {
            Alert.alert("Missing Info", "Please fill in all search fields.");
            return;
        }

        if (!hasRapidApiKey()) {
            Alert.alert("Missing API key", "Please set EXPO_PUBLIC_RAPIDAPI_KEY in your environment.");
            return;
        }

        setLoading(true);
        setIsSearching(true);
        setResults([]);

        try {
            const params = { origin, destination, departDate };
            const fetchedResults = await apiSearchFlights(params);
            setResults(fetchedResults);
        } catch (error) {
            const msg = error?.message || "Failed to fetch flights";
            Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    const renderFlightCard = (flight, index) => (
        <View key={flight.id || index} style={styles.flightCard}>
            <View style={styles.flightHeader}>
                <View>
                    <Text style={styles.airline}>{flight.airline || 'Qatar Airways'}</Text>
                    <View style={styles.flightTime}>
                        <Text style={styles.time}>08:00</Text>
                        <View style={styles.flightPath}>
                            <View style={styles.flightDot}></View>
                            <View style={styles.flightLine}></View>
                            <View style={styles.flightDot}></View>
                        </View>
                        <Text style={styles.time}>11:00</Text>
                    </View>
                    <Text style={styles.flightRoute}>DEL - BOM</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{flight.price || '3,517'}</Text>
                    <Text style={styles.priceLabel}>Price per person</Text>
                </View>
            </View>
            <View style={styles.flightDetails}>
                <View style={styles.detailItem}>
                    <MaterialIcons name="flight-takeoff" size={16} color="#666" />
                    <Text style={styles.detailText}>Non-stop</Text>
                </View>
                <View style={styles.detailItem}>
                    <MaterialIcons name="schedule" size={16} color="#666" />
                    <Text style={styles.detailText}>3h 00m</Text>
                </View>
                <View style={styles.detailItem}>
                    <MaterialIcons name="airplanemode-active" size={16} color="#666" />
                    <Text style={styles.detailText}>Boeing 787</Text>
                </View>
            </View>
            <View style={styles.flightFooter}>
                <View style={styles.departureInfo}>
                    <Text style={styles.departureTime}>08:00</Text>
                    <Text style={styles.departureDate}>Mon, 15 Nov</Text>
                </View>
                <View style={styles.separator}>
                    <View style={styles.separatorLine} />
                    <View style={styles.planeIcon}>
                        <MaterialIcons name="flight" size={16} color="#0E2A47" />
                    </View>
                </View>
                <View style={styles.arrivalInfo}>
                    <Text style={styles.arrivalTime}>11:00</Text>
                    <Text style={styles.arrivalDate}>Mon, 15 Nov</Text>
                </View>
                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scroll}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("../../assets/images/wingairplane.jpg")}
                            style={styles.upperImage}
                        />
                    </View>

                    <View style={styles.headerRight}>
                        <Text style={styles.greeting}>Good Morning</Text>
                        <Text style={styles.userName}>{userName}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profilePic}
                        onPress={() => router.push('/(tabs)/profile')}
                    >
                        <MaterialIcons name="person-outline" size={24} color="#0E2A47" />
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <Text style={styles.title}>Securely Book{"\n"}Your Flight Ticket</Text>

                {/* Search Form */}
                <View style={styles.form}>
                    {/* Origin */}
                    <View style={styles.inputGroup}>
                        <MaterialIcons name="flight-takeoff" size={20} color="#0E2A47" />
                        <TextInput
                            style={styles.input}
                            placeholder="From"
                            value={origin}
                            onChangeText={handleOriginChange}
                        />
                    </View>
                    {showOriginSuggestions && originSuggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            {originSuggestions.map((s) => (
                                <TouchableOpacity
                                    key={`${s.skyId}-${s.entityId}`}
                                    style={styles.suggestionItem}
                                    onPressIn={() => selectOriginSuggestion(s)}
                                >
                                    <Text weight="medium" style={styles.suggestionTitle}>
                                        {s.suggestionTitle || s.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Destination */}
                    <View style={styles.inputGroup}>
                        <MaterialIcons name="flight-land" size={20} color="#0E2A47" />
                        <TextInput
                            style={styles.input}
                            placeholder="To"
                            value={destination}
                            onChangeText={handleDestinationChange}
                        />
                    </View>
                    {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            {destinationSuggestions.map((s) => (
                                <TouchableOpacity
                                    key={`${s.skyId}-${s.entityId}`}
                                    style={styles.suggestionItem}
                                    onPressIn={() => selectDestinationSuggestion(s)}
                                >
                                    <Text weight="medium" style={styles.suggestionTitle}>
                                        {s.suggestionTitle || s.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Trip Type */}
                    <View style={styles.radioGroup}>
                        <TouchableOpacity
                            style={[styles.radioButton, tripType === 'oneway' && styles.radioButtonActive]}
                            onPress={() => setTripType('oneway')}
                        >
                            <Text style={[styles.radioText, tripType === 'oneway' && styles.radioTextActive]}>One Way</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.radioButton, tripType === 'roundtrip' && styles.radioButtonActive]}
                            onPress={() => setTripType('roundtrip')}
                        >
                            <Text style={[styles.radioText, tripType === 'roundtrip' && styles.radioTextActive]}>Round Trip</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Departure Date */}
                    <View style={styles.dateRow}>
                        <View style={[styles.inputGroup, styles.dateInputGroup]}>
                            <MaterialIcons name="calendar-today" size={18} color="#0E2A47" />
                            <View style={styles.dateInputInner}>
                                <Text style={styles.dateLabel}>Departure</Text>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <Text style={styles.dateText}>
                                        {departDate.toDateString()}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={departDate}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) {
                                                setDepartDate(selectedDate);
                                                if (selectedDate > returnDate) {
                                                    setReturnDate(selectedDate);
                                                }
                                            }
                                        }}
                                        minimumDate={new Date()}
                                    />
                                )}
                            </View>
                        </View>

                        {/* Return Date */}
                        {tripType === 'roundtrip' && (
                            <View style={[styles.inputGroup, styles.dateInputGroup, styles.returnDateGroup]}>
                                <MaterialIcons name="calendar-today" size={18} color="#0E2A47" />
                                <View style={styles.dateInputInner}>
                                    <Text style={styles.dateLabel}>Return</Text>
                                    <TouchableOpacity onPress={() => setShowReturnDatePicker(true)}>
                                        <Text style={styles.dateText}>
                                            {returnDate.toDateString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showReturnDatePicker && (
                                        <DateTimePicker
                                            value={returnDate}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowReturnDatePicker(false);
                                                if (selectedDate) {
                                                    setReturnDate(selectedDate);
                                                }
                                            }}
                                            minimumDate={departDate}
                                        />
                                    )}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Passengers */}
                    <View style={styles.inputGroup}>
                        <MaterialIcons name="person-outline" size={20} color="#0E2A47" />
                        <View style={styles.passengerContainer}>
                            <Text style={styles.dateLabel}>Passengers</Text>
                            <View style={styles.passengerSelector}>
                                <TouchableOpacity
                                    style={styles.passengerButton}
                                    onPress={() => setPassengers(Math.max(1, passengers - 1))}
                                >
                                    <Text style={styles.passengerButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.passengerCount}>{passengers}</Text>
                                <TouchableOpacity
                                    style={styles.passengerButton}
                                    onPress={() => setPassengers(passengers + 1)}
                                >
                                    <Text style={styles.passengerButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Search Button */}
                    <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Search Flight</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Results Section */}
                <View style={styles.upcoming}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.upcomingTitle}>
                            {isSearching ? "Available Flights" : "Upcoming Flights"}
                        </Text>
                        {!isSearching && (
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/bookings')}
                                style={styles.viewAllButton}
                            >
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {isSearching ? (
                        <>
                            {loading ? (
                                <ActivityIndicator size="large" color="#0E2A47" style={styles.loader} />
                            ) : results.length > 0 ? (
                                results.map((flight, index) => renderFlightCard(flight, index))
                            ) : (
                                <Text style={styles.noResults}>No flights found. Try a different route.</Text>
                            )}
                        </>
                    ) : (
                        <>
                            {isLoadingBookings ? (
                                <ActivityIndicator size="large" color="#0E2A47" style={styles.loader} />
                            ) : upcomingFlights.length > 0 ? (
                                upcomingFlights.map((flight, index) => renderFlightCard({
                                    ...flight,
                                    price: typeof flight.price === 'number' ? `$${flight.price}` : flight.price,
                                }, index))
                            ) : (
                                <View style={styles.noUpcomingContainer}>
                                    <MaterialIcons name="flight" size={40} color="#9CA3AF" />
                                    <Text style={styles.noUpcomingText}>No upcoming flights</Text>
                                    <Text style={styles.noUpcomingSubtext}>Your upcoming trips will appear here</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TabIndex;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f7f7f7" },
    scroll: { padding: 20, paddingBottom: 100 },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
    greeting: { color: "#000", fontSize: 14 },
    userName: { color: "#000", fontSize: 18, fontWeight: "bold" },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    upperImage: {
        width: 600,
        height: 700,
        left: -200,
    },
    headerRight: {
        alignItems: "flex-start",
        marginLeft: -340
    },
    title: {
        color: "#000",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 25,
        lineHeight: 28,
    },
    form: {
        backgroundColor: "#fff",
        borderRadius: 25,
        padding: 20,
        marginBottom: 25,
    },
    inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 15,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 55,
    },
    input: { flex: 1, marginLeft: 10, fontSize: 15, color: "#000" },
    dateRow: { flexDirection: 'row', marginBottom: 15 },
    dateInputGroup: { flex: 1, height: 'auto', paddingVertical: 10 },
    returnDateGroup: { marginLeft: 10 },
    dateInputInner: { flex: 1, marginLeft: 10 },
    dateLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
    dateText: { fontSize: 15, color: '#000' },
    radioGroup: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        padding: 5,
        marginBottom: 15,
    },
    radioButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    radioButtonActive: {
        backgroundColor: '#0E2A47',
    },
    radioText: {
        color: '#000',
        fontWeight: '500',
    },
    radioTextActive: {
        color: '#fff',
    },
    passengerContainer: { flex: 1, marginLeft: 10 },
    passengerSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passengerButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    passengerButtonText: {
        fontSize: 18,
        color: '#0E2A47',
        lineHeight: 20,
    },
    passengerCount: {
        marginHorizontal: 15,
        fontSize: 16,
        color: '#000',
        minWidth: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: "#0E2A47",
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    upcoming: {
        marginTop: 10,
        paddingHorizontal: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingLeft: 5,
    },
    upcomingTitle: {
        color: "#000",
        fontWeight: "600",
        fontSize: 18,
    },
    viewAllButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    viewAllText: {
        color: "#0E2A47",
        fontSize: 14,
        fontWeight: "500",
    },
    loader: { marginTop: 15 },
    flightCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    flightHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
    },
    airline: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    flightTime: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    time: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0E2A47',
    },
    flightPath: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    flightDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0E2A47',
    },
    flightLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    flightRoute: {
        fontSize: 14,
        color: '#666',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0E2A47',
        marginBottom: 2,
    },
    priceLabel: {
        fontSize: 12,
        color: '#999',
    },
    flightDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 5,
        fontSize: 13,
        color: '#666',
    },
    flightFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    departureInfo: {
        alignItems: 'flex-start',
    },
    arrivalInfo: {
        alignItems: 'flex-end',
    },
    departureTime: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    departureDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    arrivalTime: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    arrivalDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    separator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#ddd',
        width: '100%',
        position: 'relative',
    },
    planeIcon: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    bookButton: {
        backgroundColor: '#0E2A47',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    noResults: {
        color: "#999",
        textAlign: "center",
        marginTop: 20,
        fontSize: 14,
    },
    noUpcomingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noUpcomingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
    },
    noUpcomingSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
    },
    suggestionsContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: -10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    suggestionTitle: {
        color: "#0E2A47",
        fontSize: 14,
    },
});