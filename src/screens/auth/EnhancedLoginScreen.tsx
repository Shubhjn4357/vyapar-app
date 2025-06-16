import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export const EnhancedLoginScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, animationsEnabled } = useTheme();
    const {
        loginAsGuest,
        loginWithGoogle,
        loginWithFacebook,
        sendSMSOTP,
        verifyMobileOTP,
        isLoading,
        error,
        clearError
    } = useAuth();

    const [authMode, setAuthMode] = useState<'options' | 'mobile' | 'otp'>('options');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    React.useEffect(() => {
        if (animationsEnabled) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(1);
            slideAnim.setValue(0);
        }
    }, []);

    const handleGuestLogin = async () => {
        try {
            await loginAsGuest();
            // Navigation will be handled by the auth state change
        } catch (error) {
            Alert.alert('Error', 'Failed to login as guest');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            Alert.alert('Error', 'Google login failed');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await loginWithFacebook();
        } catch (error) {
            Alert.alert('Error', 'Facebook login failed');
        }
    };

    const handleSendOTP = async () => {
        if (!mobile || mobile.length < 10) {
            Alert.alert('Error', 'Please enter a valid mobile number');
            return;
        }

        try {
            await sendSMSOTP(mobile);
            setAuthMode('otp');
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP');
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        try {
            const result = await verifyMobileOTP(mobile, otp);
            if (result.isNewUser) {
                // Navigate to profile completion
                navigation.navigate('CompleteProfile' as never);
            }
        } catch (error) {
            Alert.alert('Error', 'Invalid OTP');
        }
    };

    const renderAuthOptions = () => (
        <Animated.View 
            style={[
                styles.authContainer,
                { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <Text style={[styles.title, { color: theme.colors.text }]}>
                Welcome to Vyapar
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Choose how you'd like to get started
            </Text>

            {/* Guest Login */}
            <TouchableOpacity
                style={[styles.authButton, styles.guestButton, { borderColor: theme.colors.border }]}
                onPress={handleGuestLogin}
                disabled={isLoading}
            >
                <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
                <View style={styles.buttonTextContainer}>
                    <Text style={[styles.buttonTitle, { color: theme.colors.text }]}>
                        Continue as Guest
                    </Text>
                    <Text style={[styles.buttonSubtitle, { color: theme.colors.textSecondary }]}>
                        Try the app offline
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Mobile Login */}
            <TouchableOpacity
                style={[styles.authButton, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setAuthMode('mobile')}
                disabled={isLoading}
            >
                <Ionicons name="phone-portrait-outline" size={24} color="white" />
                <View style={styles.buttonTextContainer}>
                    <Text style={[styles.buttonTitle, { color: 'white' }]}>
                        Login with Mobile
                    </Text>
                    <Text style={[styles.buttonSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
                        Get OTP on your mobile
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>

            {/* Social Login Divider */}
            <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
                <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                    or continue with
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    onPress={handleGoogleLogin}
                    disabled={isLoading}
                >
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    onPress={handleFacebookLogin}
                    disabled={isLoading}
                >
                    <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
            </View>

            {/* Terms and Privacy */}
            <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                By continuing, you agree to our{' '}
                <Text style={{ color: theme.colors.primary }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: theme.colors.primary }}>Privacy Policy</Text>
            </Text>
        </Animated.View>
    );

    const renderMobileInput = () => (
        <Animated.View 
            style={[
                styles.authContainer,
                { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => setAuthMode('options')}
            >
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.colors.text }]}>
                Enter Mobile Number
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                We'll send you a verification code
            </Text>

            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.countryCode, { color: theme.colors.text }]}>+91</Text>
                <TextInput
                    style={[styles.mobileInput, { color: theme.colors.text }]}
                    placeholder="Enter mobile number"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                    maxLength={10}
                    autoFocus
                />
            </View>

            <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSendOTP}
                disabled={isLoading || mobile.length < 10}
            >
                <Text style={styles.primaryButtonText}>
                    {isLoading ? 'Sending...' : 'Send OTP'}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderOTPInput = () => (
        <Animated.View 
            style={[
                styles.authContainer,
                { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => setAuthMode('mobile')}
            >
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.colors.text }]}>
                Verify OTP
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Enter the 6-digit code sent to {mobile}
            </Text>

            <TextInput
                style={[styles.otpInput, { 
                    backgroundColor: theme.colors.surface, 
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                }]}
                placeholder="000000"
                placeholderTextColor={theme.colors.textSecondary}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                autoFocus
            />

            <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
            >
                <Text style={styles.primaryButtonText}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.resendButton}
                onPress={handleSendOTP}
                disabled={isLoading}
            >
                <Text style={[styles.resendText, { color: theme.colors.primary }]}>
                    Resend OTP
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.background}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <BlurView intensity={20} style={styles.blurContainer}>
                        {authMode === 'options' && renderAuthOptions()}
                        {authMode === 'mobile' && renderMobileInput()}
                        {authMode === 'otp' && renderOTPInput()}
                    </BlurView>
                </ScrollView>
            </LinearGradient>

            {error && (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.error }]}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={clearError}>
                        <Ionicons name="close" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    blurContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        padding: 30,
    },
    authContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
        lineHeight: 22,
    },
    authButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        width: '100%',
    },
    guestButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    primaryButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        width: '100%',
    },
    buttonTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    termsText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 20,
        padding: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 24,
        paddingHorizontal: 16,
        width: '100%',
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 12,
    },
    mobileInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
    },
    otpInput: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 24,
        width: '100%',
    },
    resendButton: {
        marginTop: 16,
    },
    resendText: {
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 8,
    },
    errorText: {
        color: 'white',
        fontSize: 14,
        flex: 1,
    },
});