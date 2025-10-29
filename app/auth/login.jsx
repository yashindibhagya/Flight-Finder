import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Sign In screen - Modern Flight Theme
 */
export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color="#0E2A47" />
                    </TouchableOpacity>

                    {/* Hero Section with Illustration */}
                    <View style={styles.heroSection}>
                        <View style={styles.planeIconContainer}>
                            <MaterialIcons name="flight" size={50} color="#0E2A47" />
                        </View>
                        <Text style={styles.greeting}>Welcome Back!</Text>
                        <Text style={styles.subGreeting}>
                            Sign in to book your next adventure
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="email" size={20} color="#0E2A47" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Email Address"
                                placeholderTextColor="#9CA3AF"
                                style={styles.textInput}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={setEmail}
                                value={email}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="lock" size={20} color="#0E2A47" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!showPassword}
                                style={styles.textInput}
                                onChangeText={setPassword}
                                value={password}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <MaterialIcons
                                    name={showPassword ? "visibility" : "visibility-off"}
                                    size={20}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={styles.signInButton}
                            onPress={handleSignIn}
                            disabled={loading}
                        >
                            <Text style={styles.signInButtonText}>
                                {loading ? "Signing In..." : "Sign In"}
                            </Text>
                            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.divider} />
                        </View>

                        {/* Social Login Options */}
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <MaterialIcons name="g-translate" size={24} color="#0E2A47" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <MaterialIcons name="facebook" size={24} color="#0E2A47" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <MaterialIcons name="apple" size={24} color="#0E2A47" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Create Account Link */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/auth/signUp")}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
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
        backgroundColor: "#F0F9FF",
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 30,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    heroSection: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 40,
    },
    planeIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#0E2A47",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    greeting: {
        fontSize: 32,
        fontWeight: "700",
        color: "#0E2A47",
        marginBottom: 8,
    },
    subGreeting: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
    },
    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#1F2937",
        paddingVertical: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: "#0E2A47",
        fontSize: 14,
        fontWeight: "600",
    },
    signInButton: {
        backgroundColor: "#0E2A47",
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        shadowColor: "#0E2A47",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    signInButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E5E7EB",
    },
    dividerText: {
        marginHorizontal: 16,
        color: "#9CA3AF",
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#F9FAFB",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    signUpText: {
        color: "#6B7280",
        fontSize: 15,
    },
    signUpLink: {
        color: "#0E2A47",
        fontSize: 15,
        fontWeight: "700",
    },
});