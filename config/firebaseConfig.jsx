// Import the functions you need from the SDKs
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBB3JCa7g8nnrsHn4zRxI9uq9MIRTXqe7I",
    authDomain: "flight-finder-ca6c7.firebaseapp.com",
    projectId: "flight-finder-ca6c7",
    storageBucket: "flight-finder-ca6c7.firebasestorage.app",
    messagingSenderId: "843889958955",
    appId: "1:843889958955:web:873332ada54c10af610a6e",
    measurementId: "G-0ZK9DLQWFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics
let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (error) {
    // Analytics might not be available in certain environments
    console.log("Analytics initialization skipped");
}
export { analytics };

export default { auth, db, storage, analytics };