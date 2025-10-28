import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ImageBackground } from 'expo-image';

export default function WelcomeScreen() {
    const router = useRouter();
    const frontImage = require('../assets/images/loading_Image.png');

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            {/* Background Image */}
            <ImageBackground
                source={frontImage}
                style={styles.imageBackground}
                resizeMode="contain"
            />

            {/* Overlay Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Finding the Best</Text>
                <Text style={styles.title}>Routes</Text>

                <Text style={styles.subtitle}>Your perfect flight is just moments away. Let’s </Text>
                <Text style={styles.subtitle}>take off soon!</Text>

                {/* Get Started Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push("selectOption/optionSignUp")}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "#155658", // Dark green background
        alignItems: "center",
        justifyContent: "center",
    },
    imageBackground: {
        width: "100%",
        height: "100%", // Reduce height so text is visible
        position: "absolute", // Position image behind content
    },
    content: {
        position: "absolute", // Place content over the image
        bottom: 100, // Move content up
        width: "100%",
        alignItems: "center",
        top: 650,
    },
    title: {
        fontSize: 34,
        color: "#000",
        fontFamily: "Poppins-Bold",
        textAlign: "left",
        top: -40,
    },
    subtitle: {
        fontSize: 14,
        color: "#000",
        fontFamily: "Poppins-Regular",
        textAlign: "left",
        top: -40,
    },
    button: {
        backgroundColor: "#F5A623", // Yellow button color
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 20,
        width: "80%",
        alignItems: "center",
        top: -60,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
    linkText: {
        fontSize: 14,
        color: "#C0C0C0",
        marginTop: 10,
        textAlign: "center",
        top: -60,
    },
    signInText: {
        fontSize: 14,
        color: "#C0C0C0",
        textDecorationLine: "underline", // Underline only "Sign In"
        fontWeight: "bold", // Make it stand out
    },
});