import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductDetail = ({ route }) => {
    const { product } = route.params;

    const variantMapping = {
        'RideScout Hoodie': {
            'S': '667aebfcd28678',
            'M': '667aebfcd28712',
            'L': '667aebfcd287a7',
            'XL': '667aebfcd28836',
            '2XL': '667aebfcd288b2'
        },
        'RideScout T-Shirt': {
            'XS': '667aea938897f5',
            'S': '667aea938898a6',
            'M': '667aea93889945',
            'L': '667aea938899c8',
            'XL': '667aea93889a57',
            '2XL': '667aea93889ad8',
            '3XL': '667aea93889b62'
        },
        'RideScout Backpack': {
            'One Size': '6682037b6b8459'
        },
        'RideScout gym bag': {
            'One Size': '66820307bc7335'
        },
        'RideScout windbreaker': {
            'S': '668201c552d5a7',
            'M': '668201c552d668',
            'L': '668201c552d709',
            'XL': '668201c552d795',
            '2XL': '668201c552d827'
        },
        'RideScout Beanie': {
            'One Size': '668200adba98e9'
        },
        'RideScout heavyweight long-sleeve shirt': {
            'S': '6681bb7fb6ef97',
            'M': '6681bb7fb6f054',
            'L': '6681bb7fb6f0e8',
            'XL': '6681bb7fb6f185'
        },
        'RideScout Pink T-Shirt': {
            'S': '6681724c0fdc97',
            'M': '6681724c0fdcf4',
            'L': '6681724c0fdd44',
            'XL': '6681724c0fdd93'
        },
        'RideScout Bandana': {
            'S': '6680e58faf9c15',
            'M': '6680e58faf9c76',
            'L': '6680e58faf9cc2'
        },
        'RideScout Drawstring bag': {
            'One Size': '6680e3c8d2b6e3'
        },
        'RideScout x Champion Backpack': {
            'One Size': '667aed89593544'
        },
        'RideScout Hat': {
            'One Size': '667aecb1d053f1'
        },
        'Embroidered RideScout Packable Jacket': {
            'S': '667aeb2a0f24c2',
            'M': '667aeb2a0f2594',
            'L': '667aeb2a0f2655',
            'XL': '667aeb2a0f2706',
            '2XL': '667aeb2a0f27b9'
        }
    };

    const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0] : {};
    const initialSize = initialVariant.size || '';
    const initialVariantId = initialVariant.id || null;
    const initialPrice = initialVariant.price || product.retail_price;

    const [selectedSize, setSelectedSize] = useState(initialSize);
    const [variantId, setVariantId] = useState(initialVariantId);
    const [price, setPrice] = useState(initialPrice);

    useEffect(() => {
        updateVariantIdAndPrice();
    }, [selectedSize]);

    const updateVariantIdAndPrice = () => {
        const productVariants = variantMapping[product.name];
        if (productVariants) {
            const newVariantId = productVariants[selectedSize];
            setVariantId(newVariantId);

            const selectedVariant = product.variants.find(variant => variant.size === selectedSize);
            if (selectedVariant) {
                setPrice(selectedVariant.price);
            } else {
                setPrice(product.retail_price);
            }
        } else {
            console.error(`No variant mapping found for product: ${product.name}`);
        }
    };

    const handlePurchase = async () => {
        try {
            if (!variantId) {
                console.error('No variant ID found for the selected size.');
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
                        variant_id: Number(variantId),
                        quantity: 1
                    }
                ]
            };

            console.log('Order Data:', JSON.stringify(orderData, null, 2));

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
