import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import slider from '../../assets/images/slider.png';

const GlassButton = ({ text, onPress }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(slideAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animate();

        return () => {
            slideAnim.setValue(0);
        };
    }, []);

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-5, 5], // Adjust the distance of the slide
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <BlurView
                intensity={50}
                tint="light"
                style={styles.glassBackground}
            />
            <View style={styles.content}>
                <Text style={styles.text}>{text}</Text>

                <Animated.View style={{ transform: [{ translateX }] }}>
                    <Image
                        source={slider}
                        style={styles.separatorImage}
                    />
                </Animated.View>

                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons
                        name="arrow-top-right"
                        size={24}
                        color="white"
                        style={styles.icon}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 58,
        width: 352,
        borderRadius: 30,
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 20,
    },
    glassBackground: {
        ...StyleSheet.absoluteFillObject,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    text: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    separatorImage: {
        height: 50,
        width: 30,
        alignSelf: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#709DBA',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GlassButton;