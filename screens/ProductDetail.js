import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

const ProductDetail = ({ route }) => {
    const { product } = route.params;

    const handlePurchase = () => {
        // Handle the purchase logic, possibly by redirecting to Printful's checkout
        console.log('Purchasing:', product.name);
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.thumbnail_url }} style={styles.image} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.retail_price}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Button title="Buy Now" onPress={handlePurchase} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 20,
        color: 'green',
        marginVertical: 10,
    },
    productDescription: {
        fontSize: 16,
        color: '#666',
    },
});

export default ProductDetail;
