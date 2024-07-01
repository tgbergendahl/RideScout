import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import logo from '../assets/RideScout.jpg';
import { useNavigation } from '@react-navigation/native';

const token = 'g5Qa8Z7Gp8WYmsNClDvRQnEqFRUzewEaejIqj4pj';

const instance = axios.create({
    baseURL: 'https://api.printful.com',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const RideScoutStore = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products...');
                const response = await instance.get('/store/products');
                console.log('Products fetched:', response.data.result);

                const productDetailsPromises = response.data.result.map(product => {
                    console.log(`Fetching details for product ID: ${product.id}`);
                    return instance.get(`/store/products/${product.id}`).then(response => response.data.result);
                });

                const productsWithDetails = await Promise.all(productDetailsPromises);

                const productsWithPrices = productsWithDetails.map(productDetail => {
                    const { sync_product, sync_variants } = productDetail;
                    console.log('Product detail:', sync_product);
                    console.log('Sync Variants:', sync_variants);

                    if (!sync_variants) {
                        console.error('No variants found for product:', sync_product.name);
                        return null;
                    }

                    const variants = sync_variants.map(variant => ({
                        id: variant.id,
                        size: variant.size,
                        price: parseFloat(variant.retail_price)
                    }));

                    console.log('Variants:', variants);

                    return {
                        id: sync_product.id,
                        name: sync_product.name,
                        thumbnail_url: sync_product.thumbnail_url,
                        variants: variants,
                        retail_price: Math.min(...variants.map(variant => variant.price)), // Display the minimum price
                    };
                }).filter(product => product !== null);

                setProducts(productsWithPrices);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products');
            }
        };

        fetchProducts();
    }, []);

    const handlePurchase = (product) => {
        navigation.navigate('ProductDetail', { product });
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>Starting at ${item.retail_price.toFixed(2)}</Text>
                        {item.thumbnail_url && <Image source={{ uri: item.thumbnail_url }} style={styles.image} />}
                        <TouchableOpacity style={styles.buyButton} onPress={() => handlePurchase(item)}>
                            <Text style={styles.buyButtonText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    productItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        width: '100%',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: 'green',
        marginTop: 5,
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 10,
    },
    buyButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 20,
    },
});

export default RideScoutStore;
