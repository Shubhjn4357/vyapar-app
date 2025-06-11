import React from 'react';
import { Banner } from 'react-native-paper';
import { useNetwork } from '../contexts/NetworkContext';

export function NetworkBanner() {
    const { isConnected } = useNetwork();

    return (
        <Banner
            visible={isConnected === false}
            icon="wifi-off"
        >
            No internet connection
        </Banner>
    );
}
