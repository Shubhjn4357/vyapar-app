import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Something went wrong!</Text>
                    <Button onPress={() => this.setState({ hasError: false })}>
                        Try again
                    </Button>
                </View>
            );
        }
        return this.props.children;
    }
}
