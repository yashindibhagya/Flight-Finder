import { StyleSheet, View } from 'react-native'


import { useRouter } from 'expo-router'
import image from '../assets/images/loading_Image.png'

export default function index() {

    const router = useRouter()
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
})