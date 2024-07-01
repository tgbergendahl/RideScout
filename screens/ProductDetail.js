import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';

const ProductDetail = ({ route }) => {
    const { product } = route.params;

    console.log('Product:', product);

    const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0] : {};
    const initialSize = initialVariant.size || '';
    const initialVariantId = initialVariant.id || null;
    const initialPrice = initialVariant.price || product.retail_price;

    const [selectedSize, setSelectedSize] = useState(initialSize);
    const [variantId, setVariantId] = useState(initialVariantId);
    const [price, setPrice] = useState(initialPrice);

    useEffect(() => {
        console.log('Selected Size:', selectedSize);

        if (product.variants) {
            const selectedVariant = product.variants.find(variant => variant.size === selectedSize);
            console.log('Selected Variant:', selectedVariant);
            if (selectedVariant) {
                setVariantId(selectedVariant.id);
                setPrice(selectedVariant.price);
            } else {
                setVariantId(null);
                setPrice(product.retail_price);
            }
        }
    }, [selectedSize]);

    const handlePurchase = async () => {
        try {
            console.log('Variant ID:', variantId);

            if (!variantId) {
                console.error('No variant ID found for the selected size.');
                return;
            }

            const orderData = {
                recipient: {
                    name: 'Customer Name',
                    address1: '123 Main St',
                    city: 'City',
                    state_code: 'CA', // Correct state code
                    country_code: 'US',
                    zip: '90210' // Correct ZIP code for the state
                },
                items: [
                    {
                        variant_id: variantId,
                        quantity: 1
                    }
                ]
            };

            console.log('Order Data:', orderData);

            const response = await fetch('https://api.printful.com/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer g5Qa8Z7Gp8WYmsNClDvRQnEqFRUzewEaejIqj4pj`
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            console.log('Printful API Response:', result);

            if (response.ok) {
                console.log('Order submitted successfully:', result);
            } else {
                console.error('Failed to submit order:', result);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.thumbnail_url }} style={styles.image} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${price}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.label}>Select Size:</Text>
            <View style={styles.sizeContainer}>
                {product.variants && product.variants.map((variant, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.sizeBox,
                            selectedSize === variant.size && styles.selectedSizeBox
                        ]}
                        onPress={() => setSelectedSize(variant.size)}
                    >
                        <Text style={[
                            styles.sizeText,
                            selectedSize === variant.size && styles.selectedSizeText
                        ]}>{variant.size}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.buyNowButton} onPress={handlePurchase}>
                <Text style={styles.buyNowButtonText}>Buy Now</Text>
            </TouchableOpacity>
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
    label: {
        fontSize: 16,
        marginTop: 20,
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    sizeBox: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        margin: 5,
        borderRadius: 5,
    },
    selectedSizeBox: {
        backgroundColor: '#000',
    },
    sizeText: {
        color: '#000',
    },
    selectedSizeText: {
        color: '#fff',
    },
    buyNowButton: {
        backgroundColor: '#000',
        padding: 15,
        alignItems: 'center',
        marginVertical: 20,
        borderRadius: 5,
    },
    buyNowButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetail;
