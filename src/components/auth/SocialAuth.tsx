import { facebookLogin, googleLoginApi } from "@/src/api/auth";
import React, { useState } from "react";
import { StyleSheet} from 'react-native';
import { Button, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AnimatedModal from "../AnimatedModal";

type Props = {
    visible: boolean;
    onDismiss: () => void;
};

export const SocialAuth: React.FC<Props> = ({ visible, onDismiss }) => {
    
        const [Error,setError]= useState<any>(null)
        const handleGoogleLogin = async () => {
           
            try {
                // You need to get googleId, email, etc. from Google SDK
                await googleLoginApi("googleId", "email@example.com");
                // handle login success
            } catch (err: any) {
                setError(err?.message || "Google login failed");
            } finally {
                onDismiss();
            }
        };
    
        const handleFacebookLogin = async () => {
            setError(null);
            try {
                // You need to get accessToken from Facebook SDK
                await facebookLogin("facebookAccessToken");
                // handle login success
            } catch (err: any) {
                setError(err?.message || "Facebook login failed");
            } finally {
                onDismiss();
            }
        };
    return (
            <AnimatedModal               
                visible={visible}
                onDismiss={onDismiss}
            >
                <Text style={styles.title}>Sign in with</Text>
                {Error && <Text>
                    {Error?.message}
                    </Text>}
                <Button
                    icon={() => <Icon name="google" color="#EA4335" size={24} />}
                    mode="outlined"
                    onPress={handleGoogleLogin}
                    style={styles.socialButton}
                >
                    Google
                </Button>
                <Button
                    icon={() => <Icon name="facebook" color="#1877F3" size={24} />}
                    mode="outlined"
                    onPress={handleFacebookLogin}
                    style={styles.socialButton}
                >
                    Facebook
                </Button>
            </AnimatedModal>
      
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        alignSelf: "center",
    },
    socialButton: {
        marginVertical: 8,
    },
});
