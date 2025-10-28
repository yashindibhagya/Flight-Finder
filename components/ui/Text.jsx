import { Text as RNText, StyleSheet } from 'react-native';

export function Text({ children, style, weight = 'regular', ...props }) {
    const fontFamily = `Poppins-${weight === 'bold' ? 'Bold' : weight === 'semiBold' ? 'SemiBold' : 'Regular'}`;

    return (
        <RNText
            style={[styles.text, { fontFamily }, style]}
            {...props}
        >
            {children}
        </RNText>
    );
}

const styles = StyleSheet.create({
    text: {
        color: '#000000',
    },
});
