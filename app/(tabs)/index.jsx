import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Button from "../../components/buttons/getStartedButton";
import { Text } from "../../components/ui/Text";
import { Colors } from "../../constants/theme";
import { useUserDetail } from "../../context/UserDetailContext";
import { searchFlights as apiSearchFlights, hasRapidApiKey, searchAirports } from "../../services/flightApi";

const TabIndex = () => {
    const { userDetail } = useUserDetail();
    const router = useRouter();
    const userName = userDetail?.name?.split(' ')[0] || "Traveler";

    const [origin, setOrigin] = useState("New York (JFK)");
    const [destination, setDestination] = useState("London (LHR)");
    const [departDate, setDepartDate] = useState("2025-12-01"); // YYYY-MM-DD
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Autocomplete state
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
        if (!origin || !destination || !departDate) {
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
            console.error(error);
            const msg = (error?.message || "Failed to fetch flights").slice(0, 200);
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
                <MaterialIcons name="flight-takeoff" size={24} color={Colors.light.tint} />
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
        <View style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingText} weight="regular">
                            Welcome Back,
                        </Text>
                        <Text style={styles.userNameText} weight="bold">
                            {userName}!
                        </Text>
                    </View>
                    <Link href="/(tabs)/profile" asChild>
                        <TouchableOpacity style={styles.profileButton}>
                            <MaterialIcons name="person-outline" size={24} color="#155658" />
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* Flight Search Form */}
                <View style={styles.searchContainer}>
                    <Text style={styles.sectionTitle} weight="semiBold">
                        Find Your Next Flight
                    </Text>

                    <View style={styles.inputGroup}>
                        <MaterialIcons name="flight-takeoff" size={20} color="#555" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Origin (e.g., JFK)"
                            value={origin}
                            onChangeText={handleOriginChange}
                            onFocus={() => setShowOriginSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 150)}
                        />
                    </View>
                    {showOriginSuggestions && originSuggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            {originSuggestions.map((s) => (
                                <TouchableOpacity key={`${s.skyId}-${s.entityId}`} style={styles.suggestionItem} onPress={() => selectOriginSuggestion(s)}>
                                    <Text weight="medium" style={styles.suggestionTitle}>{s.suggestionTitle || s.title}</Text>
                                    {s.subtitle ? <Text style={styles.suggestionSubtitle}>{s.subtitle}</Text> : null}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <MaterialIcons name="flight-land" size={20} color="#555" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Destination (e.g., LHR)"
                            value={destination}
                            onChangeText={handleDestinationChange}
                            onFocus={() => setShowDestinationSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 150)}
                        />
                    </View>
                    {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            {destinationSuggestions.map((s) => (
                                <TouchableOpacity key={`${s.skyId}-${s.entityId}`} style={styles.suggestionItem} onPress={() => selectDestinationSuggestion(s)}>
                                    <Text weight="medium" style={styles.suggestionTitle}>{s.suggestionTitle || s.title}</Text>
                                    {s.subtitle ? <Text style={styles.suggestionSubtitle}>{s.subtitle}</Text> : null}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <MaterialIcons name="calendar-today" size={18} color="#555" style={styles.inputIcon} />
                        {/* Note: In a real RN app, you would use a DatePicker component here */}
                        <TextInput
                            style={styles.input}
                            placeholder="Departure Date (YYYY-MM-DD)"
                            value={departDate}
                            onChangeText={setDepartDate}
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>

                    <Button
                        text={loading ? "Searching..." : "Search Flights"}
                        onPress={handleSearch}
                        loading={loading}
                    />
                </View>

                {/* Results Section */}
                <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle} weight="bold">
                        {isSearching ? "Search Results" : "Top Destinations"}
                    </Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.light.tint} />
                            <Text style={styles.loadingText}>Searching the skies...</Text>
                        </View>
                    ) : results.length > 0 ? (
                        <View style={styles.resultsList}>
                            {results.map(renderFlightCard)}
                        </View>
                    ) : isSearching ? (
                        <Text style={styles.noResultsText}>No direct flights found. Try adjusting your dates.</Text>
                    ) : (
                        // Placeholder for initial load / no search done
                        <View style={styles.placeholderContainer}>
                            <Text weight="medium" style={styles.placeholderItem}>New York to Tokyo - $850</Text>
                            <Text weight="medium" style={styles.placeholderItem}>London to Paris - $120</Text>
                            <Text weight="medium" style={styles.placeholderItem}>Sydney to Dubai - $990</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default TabIndex;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#D0F3DA',
    },
    container: {
        flexGrow: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greetingText: {
        fontSize: 18,
        color: '#555',
    },
    userNameText: {
        fontSize: 24,
        color: '#155658',
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    searchContainer: {
        backgroundColor: '#E6FFE6',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#155658',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#B0D0B0',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#333',
    },
    resultsSection: {
        paddingHorizontal: 10,
    },
    suggestionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: -10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    suggestionItem: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    suggestionTitle: {
        color: '#155658',
    },
    suggestionSubtitle: {
        color: '#777',
        fontSize: 12,
        marginTop: 2,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#155658',
    },
    resultsList: {
        gap: 15,
    },
    flightCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        borderLeftWidth: 5,
        borderLeftColor: Colors.light.tint,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 5,
    },
    priceText: {
        fontSize: 22,
        color: Colors.light.tint,
    },
    cardDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        color: '#777',
        fontSize: 14,
    },
    noResultsText: {
        textAlign: 'center',
        color: '#777',
        marginTop: 20,
    },
    placeholderContainer: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        gap: 8,
    },
    placeholderItem: {
        color: '#444',
    }
});