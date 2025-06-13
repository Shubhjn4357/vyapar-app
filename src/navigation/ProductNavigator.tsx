import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductsScreen } from '../screens/products/ProductsScreen';

export type ProductStackParamList = {
    ProductsList: undefined;
    ProductDetails: { productId: string };
    AddProduct: undefined;
    EditProduct: { productId: string };
};

const Stack = createStackNavigator<ProductStackParamList>();

export default function ProductNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="ProductsList"
                component={ProductsScreen}
            />
        </Stack.Navigator>
    );
}