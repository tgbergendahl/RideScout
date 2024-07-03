import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { fetchProductDetails, createOrder, fetchStoreId, fetchProductVariants } from '../api/printful';
import { useStripe } from '@stripe/stripe-react-native';

const ProductDetail = ({ route }) => {
    const { product } = route.params;

    const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0] : {};
    const initialSize = initialVariant.size || '';
    const initialPrice = initialVariant.price || product.retail_price;

    const [selectedSize, setSelectedSize] = useState(initialSize);
    const [variantId, setVariantId] = useState(initialVariant.id);
    const [price, setPrice] = useState(initialPrice);
    const [storeId, setStoreId] = useState(null);
    const [variants, setVariants] = useState(product.variants || []);
    const [message, setMessage] = useState('');

    const stripe = useStripe();

    useEffect(() => {
        const getStoreIdFromAPI = async () => {
            try {
                const id = await fetchStoreId();
                setStoreId(id);
            } catch (error) {
                console.error('Error fetching store ID:', error);
            }
        };

        getStoreIdFromAPI();
    }, []);

    useEffect(() => {
        const getVariantsFromAPI = async () => {
            try {
                const fetchedVariants = await fetchProductVariants(product.id);
                setVariants(fetchedVariants);
            } catch (error) {
                console.error('Error fetching product variants:', error);
            }
        };

        getVariantsFromAPI();
    }, [product.id]);

    useEffect(() => {
        updateVariantIdAndPrice();
    }, [selectedSize, variants]);

    const updateVariantIdAndPrice = () => {
        if (variants.length > 0) {
            const selectedVariant = variants.find(variant => variant.size === selectedSize);
            if (selectedVariant) {
                setVariantId(selectedVariant.id);
                setPrice(parseFloat(selectedVariant.price));
                console.log('Selected Variant ID:', selectedVariant.id);
                console.log('Selected Variant Price:', selectedVariant.price);
            } else {
                setVariantId(initialVariant.id);
                setPrice(initialPrice);
                console.log('Default Variant ID:', initialVariant.id);
                console.log('Default Price:', initialPrice);
            }
        } else {
            console.error(`No variants found for product: ${product.name}`);
        }
    };

    const fetchPaymentIntentClientSecret = async () => {
        try {
            const response = await fetch('http://localhost:3000/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: price * 100 }), // amount in cents
            });
            const { clientSecret } = await response.json();
            return clientSecret;
        } catch (error) {
            console.error('Error fetching client secret:', error);
            setMessage('Error initiating payment. Please try again.');
        }
    };

    const handlePayment = async () => {
        const clientSecret = await fetchPaymentIntentClientSecret();
        if (!clientSecret) return;

        const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
            type: 'Card',
            billingDetails: {
                name: 'Customer Name',
                email: 'customer@example.com',
            },
        });

        if (error) {
            console.error('Payment confirmation error', error);
            Alert.alert('Error', error.message);
        } else if (paymentIntent) {
            console.log('Payment successful', paymentIntent);
            Alert.alert('Success', 'Payment successful');
            handlePurchase(paymentIntent);
        }
    };

    const handlePurchase = async (paymentDetails) => {
        try {
            if (!variantId || !storeId) {
                console.error('Missing variant ID or store ID.');
                return;
            }

            const orderData = {
                recipient: {
                    name: 'Customer Name',
                    address1: '123 Main St',
                    city: 'City',
                    state_code: 'CA',
                    country_code: 'US',
                    zip: '90210'
                },
                items: [
                    {
                        variant_id: variantId,
                        quantity: 1
                    }
                ],
                store_id: storeId,
                payment_details: paymentDetails
            };

            console.log('Order Data:', JSON.stringify(orderData, null, 2));

            const response = await createOrder(orderData);

            console.log('Order submitted successfully:', response);
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
                {variants && variants.map((variant, index) => (
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
            <Button title="Pay with Stripe" onPress={handlePayment} />
            {message ? <Text>{message}</Text> : null}
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
});

export default ProductDetail;
