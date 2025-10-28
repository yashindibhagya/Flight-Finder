import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import GlassButton from '../components/buttons/getStartedButton';

const { width, height } = Dimensions.get('window');

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
                contentFit="cover"
            >
                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>Finding the Best</Text>
                    <Text style={[styles.title, { marginBottom: 16 }]}>Routes</Text>

                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>Your perfect flight is just moments away. Let's</Text>
                        <Text style={styles.subtitle}>take off soon!</Text>
                    </View>

                    {/* Get Started Button */}
                    <GlassButton
                        text="Get Started"
                        onPress={() => router.push("auth/login")}
                        style={styles.button}
                    />
                </View>
            </ImageBackground>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 60,
    },
    title: {
        fontSize: 34,
        color: '#000',
        fontFamily: 'Poppins-Bold',
        lineHeight: 50,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        left: 10
    },
    subtitleContainer: {
        marginBottom: 30,
        left: 10
    },
    subtitle: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Poppins-Regular',
        lineHeight: 22,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    button: {
        top: -10,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        textAlign: 'center',
    },
});