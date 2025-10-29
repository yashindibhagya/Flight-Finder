import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/buttons/getStartedButton";

/**
 * Sign In screen
 */
export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle sign in
    const handleSignIn = () => {
        // Validate input
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        if (!password) {
            Alert.alert("Error", "Please enter your password");
            return;
        }

        setLoading(true);

        // Simulate async operation
        setTimeout(() => {
            setLoading(false);
            // Navigate to home page
            router.replace("/(tabs)");
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={20} color="black" />
                    </TouchableOpacity>

                    {/* Logo */}
                    <Image
                        source={require("../../assets/images/logo.png")}
                        style={styles.logo}
                    />

                    {/* Header */}
                    <Text style={styles.heading}>Welcome Back</Text>
                    <Text style={styles.subHeading}>
                        Sign in to continue your journey
                    </Text>

                    {/* Form */}
                    <TextInput
                        placeholder="Email"
                        style={styles.textInput}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        value={email}
                    />

                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.textInput}
                        onChangeText={setPassword}
                        value={password}
                    />

                    {/* Sign In Button */}
                    <Button
                        text="Sign In"
                        onPress={handleSignIn}
                        loading={loading}
                        style={styles.button}
                    />

                    {/* Create Account Link */}
                    <View style={styles.buttonContainer}>
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/auth/signUp")}>
                            <Text style={styles.signUpLink}>Create New Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#D0F3DA",
        marginTop: 25
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: "center",
        padding: 25,
    },
    logo: {
        width: 100,
        height: 100,
        marginTop: 80,
        marginBottom: 20,
    },
    heading: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#155658",
    },
    subHeading: {
        textAlign: "center",
        fontSize: 16,
        color: "#555",
        marginBottom: 30,
    },
    textInput: {
        width: "90%",
        padding: 15,
        fontSize: 16,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        backgroundColor: "rgba(255,255,255,0.4)",
        borderRadius: 5,
    },
    button: {
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    signUpLink: {
        color: "#155658",
        fontWeight: "bold",
        marginLeft: 5,
    },
    lowerLeaves: {
        top: 30,
        height: 300,
        opacity: 0.4,
    },

    backButton: {
        position: "absolute",
        top: 20,
        left: 10,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 30,
        zIndex: 1,
    },
});
