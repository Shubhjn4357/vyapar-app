import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PaymentsScreen } from '../screens/payments/PaymentsScreen';

export type PaymentStackParamList = {
    PaymentsList: undefined;
    PaymentDetails: { paymentId: string };
    AddPayment: undefined;
    EditPayment: { paymentId: string };
};

const Stack = createStackNavigator<PaymentStackParamList>();

export default function PaymentNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="PaymentsList"
                component={PaymentsScreen}
            />
        </Stack.Navigator>
    );
}