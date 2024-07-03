// api/printful.js
const axios = require('axios').default;

const PRINTFUL_API_KEY = 'WjRHtF1EWpfdAqEnt0xGbYXUGONzYwG2jujHD6ZZ';

axios.defaults.validateStatus = function () {
    return true;
};

const fetchStoreId = async () => {
    try {
        const response = await axios.get('https://api.printful.com/stores', {
            headers: {
                'Authorization': `Bearer ${PRINTFUL_API_KEY}`
            }
        });

        if (response.status !== 200) {
            throw new Error(`Error fetching store ID: ${response.data.error.message}`);
        }

        return response.data.result[0].id; // Assuming the first store is the one we need
    } catch (error) {
        console.error('Error fetching store ID:', error.message);
        throw error;
    }
};

const fetchProductDetails = async (productId) => {
    try {
        const response = await axios.get(`https://api.printful.com/store/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${PRINTFUL_API_KEY}`
            }
        });

        if (response.status !== 200) {
            throw new Error(`Error fetching product details: ${response.data.error.message}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        throw error;
    }
};

const fetchProductVariants = async (productId) => {
    try {
        const response = await axios.get(`https://api.printful.com/store/products/${productId}/variants`, {
            headers: {
                'Authorization': `Bearer ${PRINTFUL_API_KEY}`
            }
        });

        if (response.status !== 200) {
            throw new Error(`Error fetching product variants: ${response.data.error.message}`);
        }

        return response.data.result; // List of variants
    } catch (error) {
        console.error('Error fetching product variants:', error.message);
        throw error;
    }
};

const createOrder = async (orderData) => {
    try {
        const response = await axios.post('https://api.printful.com/orders', orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PRINTFUL_API_KEY}`
            }
        });

        if (response.status !== 200) {
            throw new Error(`Error creating order: ${response.data.error.message}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error creating order:', error.message);
        throw error;
    }
};

module.exports = {
    fetchStoreId,
    fetchProductDetails,
    fetchProductVariants,
    createOrder
};
