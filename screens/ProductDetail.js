import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { fetchProductDetails, createOrder, fetchStoreId, fetchProductVariants } from '../api/printful';
import { useStripe, CardField } from '@stripe/stripe-react-native';

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
    const [recipientName, setRecipientName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');

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
            const response = await fetch('http://[2600:8805:dc88:4f00:1996:6770:3a18:49a0]:3000/create-payment-intent', {
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
                name: recipientName,
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
                    name: recipientName,
                    address1: address,
                    city: city,
                    state_code: state,
                    country_code: country,
                    zip: zip
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView contentContainerStyle={styles.container}>
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
                <Text style={styles.label}>Recipient Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Recipient Name"
                    value={recipientName}
                    onChangeText={setRecipientName}
                />
                <Text style={styles.label}>Address:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <Text style={styles.label}>City:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                />
                <Text style={styles.label}>State:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={state}
                    onChangeText={setState}
                />
                <Text style={styles.label}>Country:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Country"
                    value={country}
                    onChangeText={setCountry}
                />
                <Text style={styles.label}>Zip:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Zip"
                    value={zip}
                    onChangeText={setZip}
                />
                <View style={{ height: 200, marginTop: 20, width: '100%' }}>
                    <CardField
                        postalCodeEnabled={true}
                        placeholder={{
                            number: '4242 4242 4242 4242',
                        }}
                        cardStyle={{
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000',
                        }}
                        style={{
                            width: '100%',
                            height: 50,
                            marginVertical: 30,
                        }}
                    />
                </View>
                <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                    <Text style={styles.payButtonText}>Pay with Stripe</Text>
                </TouchableOpacity>
                {message ? <Text>{message}</Text> : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 8,
        marginBottom: 20,
        borderRadius: 5,
    },
    payButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProductDetail;
