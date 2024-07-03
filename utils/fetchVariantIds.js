(async () => {
    const fetch = await import('node-fetch');

    const API_URL = 'https://api.printful.com/products/{product_id}'; // replace {product_id} with actual product ID
    const API_KEY = 'WjRHtF1EWpfdAqEnt0xGbYXUGONzYwG2jujHD6ZZ'; // replace with your actual API key

    const fetchVariantIds = async () => {
        try {
            const response = await fetch.default(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch product details: ${response.statusText}`);
            }

            const data = await response.json();
            const variants = data.result.variants;

            console.log('Variants:', variants);

            variants.forEach(variant => {
                console.log(`Variant ID: ${variant.id}, Size: ${variant.size}, Price: ${variant.price}`);
            });

        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchVariantIds();
})();
