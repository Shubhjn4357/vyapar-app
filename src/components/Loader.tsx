import { View, StyleSheet } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper';

const Loader = () => {
  return (
        <View style={styles.container}>
            <ActivityIndicator size="large" style={styles.loader} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        marginVertical: 20,
    }
});
export default Loader