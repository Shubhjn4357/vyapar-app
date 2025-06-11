import React, { useRef, useEffect } from 'react';
import { Modal, Portal } from 'react-native-paper';
import { Animated, StyleSheet } from 'react-native';
import { useStyle } from '../hooks/useStyle';

const AnimatedModal = ({ visible, onDismiss, children }:{
    visible: boolean;
    onDismiss: () => void;
    children: React.ReactNode;
}) => {
    const animationValue = useRef(new Animated.Value(0)).current;
    const style= useStyle()
    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, animationValue]);

    const modalStyle = {
        opacity: animationValue,
        transform: [
            {
                translateY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0], // Slide up animation
                }),
            },
        ],
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={style.modalContainer}>
                <Animated.View style={ modalStyle}>
                    {children}
                </Animated.View>
            </Modal>
        </Portal>
    );
};


export default AnimatedModal;