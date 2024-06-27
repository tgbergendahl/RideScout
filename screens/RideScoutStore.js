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
    const navigation = useNavigation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await instance.get('/store/products');
                setProducts(response.data.result);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handlePurchase = (product) => {
        // Redirect to the product purchase page or handle in-app purchase logic here
        // For example, navigating to a product detail page
        navigation.navigate('ProductDetail', { product });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logo} style={styles.logo} />
            </View>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>${item.retail_price}</Text>
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
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 10,
        marginBottom: 20,
    },
    logo: {
        width: 300,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    productItem: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 5,
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
});

export default RideScoutStore;
