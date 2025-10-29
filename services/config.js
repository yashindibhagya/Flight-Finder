import Constants from 'expo-constants';

export const getRapidApiKey = () => {
    const fromEnv = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
    const fromExtra = Constants?.expoConfig?.extra?.RAPIDAPI_KEY
        || Constants?.manifest?.extra?.RAPIDAPI_KEY
        || Constants?.manifest2?.extra?.RAPIDAPI_KEY;
    return fromEnv || fromExtra || '';
};

export default { getRapidApiKey };


