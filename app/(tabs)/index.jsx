import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
//import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
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
    const userName = userDetail?.name?.split(" ")[0] || "Traveler";

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

    const renderFlightCard = (flight) => (
        <TouchableOpacity
            key={flight.id}
            style={styles.flightCard}
            onPress={() => router.push(`/details/${flight.id}`)}
        >
            <View style={styles.cardHeader}>
                <Text weight="semiBold" style={styles.priceText}>
                    {flight.price}
                </Text>
                <MaterialIcons name="flight-takeoff" size={24} color="#0E2A47" />
            </View>
            <View style={styles.cardDetailRow}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text weight="medium">{flight.duration}</Text>
            </View>
            <View style={styles.cardDetailRow}>
                <Text style={styles.detailLabel}>Stops:</Text>
                <Text weight="medium">{flight.stops}</Text>
            </View>
            <View style={styles.cardDetailRow}>
                <Text style={styles.detailLabel}>Airline:</Text>
                <Text weight="medium">{flight.airline}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                {/* Top Blue Header */}
                <View style={styles.topHeader}>
                    <View style={styles.headerContent}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require("../../assets/images/wingairplane.jpg")}
                                style={styles.logo}
                                contentFit="contain"
                            />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.greeting}>Good Morning</Text>
                            <Text style={styles.userName}>{userName}</Text>
                        </View>
                        <TouchableOpacity style={styles.profilePic}>
                            <MaterialIcons name="person-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                
                {/* Search Form */}
                <View style={styles.searchFormContainer}>
                    <Text style={styles.searchTitle}>Where would you like to go?</Text>
                    <Text style={styles.searchSubtitle}>Discover your next adventure</Text>
                    
                    <View style={styles.searchBox}>
                        <MaterialIcons name="search" size={24} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for a destination..."
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>
            </View>
            
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                {/* Title */}

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
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={styles.dateLabel}>Departure</Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                >
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
                                                // If return date is before departure date, update it
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

                        {/* Return Date - Only show for round trip */}
                        {tripType === 'roundtrip' && (
                            <View style={[styles.inputGroup, styles.dateInputGroup, { marginLeft: 10 }]}>
                                <MaterialIcons name="calendar-today" size={18} color="#0E2A47" />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.dateLabel}>Return</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowReturnDatePicker(true)}
                                    >
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
                        <View style={{ flex: 1, marginLeft: 10 }}>
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
                    <Text style={styles.upcomingTitle}>
                        {isSearching ? "Available Flights" : "Upcoming Flights"}
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 15 }} />
                    ) : results.length > 0 ? (
                        results.map(renderFlightCard)
                    ) : isSearching ? (
                        <Text style={styles.noResults}>No flights found. Try a different route.</Text>
                    ) : (
                        <View style={styles.flightCard}>
                            <Text style={styles.airline}>Qatar Airways</Text>
                            <Text style={styles.price}>₹3,517</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TabIndex;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    scroll: { padding: 0, paddingBottom: 20 },
    headerContainer: {
        backgroundColor: '#0E2A47',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 20,
        marginBottom: 20,
    },
    topHeader: {
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
    greeting: { 
        color: "rgba(255, 255, 255, 0.8)", 
        fontSize: 14,
        marginBottom: 2,
    },
    userName: { 
        color: "#fff", 
        fontSize: 16, 
        fontWeight: "600" 
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    searchFormContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    searchTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    searchSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    title: {
        color: "#fff",
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
    dateInput: { flex: 1, justifyContent: 'center' },
    dateRow: { flexDirection: 'row', marginBottom: 15 },
    dateInputGroup: { flex: 1, height: 'auto', paddingVertical: 10 },
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
        color: '#666',
        fontWeight: '500',
    },
    radioTextActive: {
        color: '#fff',
    },
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
    upcoming: { marginTop: 10 },
    upcomingTitle: { color: "#fff", fontWeight: "600", fontSize: 16, marginBottom: 10 },
    flightCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginTop: 10,
    },
    airline: { color: "#0E2A47", fontWeight: "600" },
    price: { color: "#0E2A47", fontWeight: "bold" },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    priceText: { fontSize: 18, color: "#0E2A47", fontWeight: "bold" },
    cardDetailRow: { flexDirection: "row", justifyContent: "space-between" },
    detailLabel: { color: "#555", fontSize: 14 },
    noResults: { color: "#BFD6FF", textAlign: "center", marginTop: 20 },
    suggestionsContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: -10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    suggestionItem: { padding: 10 },
    suggestionTitle: { color: "#0E2A47" },
});
