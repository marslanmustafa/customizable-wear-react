import { getApiBaseUrl } from '../utils/config';

export const getTokenFromCookies = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const addBundleToCart = async (bundleData, token) => {
  const API_URL = getApiBaseUrl();
  try {

    const response = await fetch(`${API_URL}/cart/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...bundleData, isBundle: true }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
        `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding bundle to cart:', error);
    throw error;
  }
};

export const prepareBundleData = ({
  method,
  positions,
  logoData,
  productsData,
  textLine = '',
  font = '',
  notes = '',
}) => {
  // Validate required fields
  if (!productsData || !Array.isArray(productsData)) {
    throw new Error('Invalid products data');
  }

  if (productsData.length !== 2) {
    throw new Error('Bundle must contain exactly 2 products');
  }

  // Format products for backend
  const bundleProducts = productsData.map((product) => {
    if (!product._id && !product.id) {
      throw new Error('Product missing ID');
    }

    const productId = product._id || product.id;
    const position = positions[productId] || 'Not selected';

    return {
      productId,
      title: product.title || product.name || 'Unknown Product',
      size: product.allSizes || [],
      color: product.color || (product.colors?.[0] || 'Not selected'),
      position: Array.isArray(position) ? position.join(', ') : position,
      price: product.price || 0,
      quantity: product.quantity || 1,
      frontImage: product.frontImage || product.image || '',
    };
  });

  // Format method to ensure proper case
  const formattedMethod = method
    ? method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
    : "Not selected";

  // Validate method against allowed values
  const allowedMethods = ['Embroidery', 'Print', 'Not selected'];
  if (!allowedMethods.includes(formattedMethod)) {
    throw new Error(`Invalid method: ${formattedMethod}`);
  }

  // Prepare the final bundle data
  const preparedData = {
    isBundle: true,
    bundleProducts,
    method: formattedMethod,
    textLine,
    font,
    notes,
    metadata: {
      bundleName: `Custom Bundle - ${bundleProducts.map(p => p.title).join(' + ')}`,
      createdAt: new Date().toISOString(),
    },
  };

  // Only add logoData if it exists and is valid
  if (logoData && (logoData.content || logoData.preview)) {
    preparedData.bundleLogoData = logoData.content || logoData.preview;

    // If it's a base64 string, ensure it's properly formatted
    if (typeof preparedData.bundleLogoData === 'string' &&
      preparedData.bundleLogoData.startsWith('data:')) {
      // Ensure the base64 string is properly formatted
      if (!preparedData.bundleLogoData.includes(';base64,')) {
        preparedData.bundleLogoData = preparedData.bundleLogoData.replace(
          /^data:image\/[a-z]+;?/,
          match => match.endsWith(';') ? `${match}base64,` : `${match};base64,`
        );
      }
    }
  }

  return preparedData;
};