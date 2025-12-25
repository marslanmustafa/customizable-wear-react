import { getApiBaseUrl } from './config';

export const handleImageUpload = (fileData, productIndex, products, setProducts) => {
  const updatedProducts = [...products];
  updatedProducts[productIndex].image = fileData;
  setProducts(updatedProducts);

};

export const handleColorImageChange = (e, productIndex, colorIndex, products, setProducts) => {
  const file = e.target.files[0];
  if (!file) return;

  setProducts((prevProducts) => {
    const updatedProducts = [...prevProducts];
    updatedProducts[productIndex].colors[colorIndex] = {
      ...updatedProducts[productIndex].colors[colorIndex],
      image: file
    };
    return updatedProducts;
  });
};



export const addColor = (productIndex, products, setProducts) => {
  setProducts((prevProducts) => {
    const updatedProducts = [...prevProducts];
    updatedProducts[productIndex].colors = [...updatedProducts[productIndex].colors, { color: '', image: null, sizes: [] }];
    return updatedProducts;
  });
};


export const handleColorChange = (productIndex, colorIndex, value, products, setProducts) => {
  const updatedProducts = [...products];
  updatedProducts[productIndex].colors[colorIndex].color = value;
  setProducts(updatedProducts);
};

export const handleSizeChange = (productIndex, colorIndex, size, products, setProducts) => {
  setProducts((prevProducts) => {
    const updatedProducts = prevProducts.map((product, pIndex) => {
      if (pIndex !== productIndex) return product; // Keep other products unchanged

      return {
        ...product,
        colors: product.colors.map((color, cIndex) => {
          if (cIndex !== colorIndex) return color; // Keep other colors unchanged

          // Toggle size selection
          const updatedSizes = color.sizes.includes(size)
            ? color.sizes.filter((s) => s !== size) // Remove size
            : [...color.sizes, size]; // Add size

          return { ...color, sizes: updatedSizes };
        }),
      };
    });

    return updatedProducts;
  });
};



export const removeColor = (productIndex, colorIndex, products, setProducts) => {
  const updatedProducts = [...products];
  updatedProducts[productIndex].colors.splice(colorIndex, 1);
  setProducts(updatedProducts);
};

export const handleCategoryChange = (category, selectedCategories, setSelectedCategories) => {
  setSelectedCategories((prevState) => ({
    ...prevState,
    [category]: !prevState[category],
  }));
};

// export const handleFormSubmit = async (products, selectedCategories) => {
//   if (products.length < 2) {
//     alert('You must have at least two products.');
//     return;
//   }

//   for (let product of products) {
//     if (!product.image || product.colors.length === 0) {
//       alert('Each product must have an image and at least one color.');
//       return;
//     }

//     for (let color of product.colors) {
//       if (!color.color || !color.image || color.sizes.length === 0) {
//         alert('Each color must have an image and at least one selected size.');
//         return;
//       }
//     }
//   }

//   const formData = new FormData();
//   products.forEach((product, productIndex) => {
//     formData.append(`productImage_${productIndex}`, product.image);

//     product.colors.forEach((color, colorIndex) => {
//       formData.append(`product_${productIndex}_color_${colorIndex}`, color.color);
//       formData.append(`product_${productIndex}_colorImage_${colorIndex}`, color.image);
//       formData.append(`product_${productIndex}_sizes_${colorIndex}`, color.sizes.join(','));
//     });
//   });

//   Object.keys(selectedCategories).forEach((category) => {
//     if (selectedCategories[category]) {
//       formData.append(`category_${category}`, category);
//     }
//   });

//   try {
//     const response = await fetch('/api/upload', {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.ok) {
//       const data = await response.json();
//        ('Images uploaded successfully', data);
//       alert('Products uploaded successfully!');
//     } else {
//       console.error('Error uploading images');
//     }
//   } catch (err) {
//     console.error('Upload failed', err);
//   }
// };
export const handleFormSubmit = async (products, selectedCategories) => {
  // Debugging: Log the current state of products

  // Validation
  if (products.length < 2) {
    alert('You must have at least two products.');
    return;
  }

  for (let product of products) {
    // Check if product image is a valid file
    if (!(product.image instanceof File)) {
      alert('Each product must have a valid image.');
      return;
    }

    // Check if product has at least one color
    if (product.colors.length === 0) {
      alert('Each product must have at least one color.');
      return;
    }

    for (let color of product.colors) {
      // Check if color is a non-empty string
      if (!color.color || typeof color.color !== 'string' || color.color.trim() === '') {
        alert('Each color must have a valid color value.');
        return;
      }

      // Check if color image is a valid file
      if (!(color.image instanceof File)) {
        alert('Each color must have a valid image.');
        return;
      }

      // Check if at least one size is selected
      if (color.sizes.length === 0) {
        alert('Each color must have at least one selected size.');
        return;
      }
    }
  }

  // Prepare FormData
  const formData = new FormData();

  // Append product images and color details
  products.forEach((product, productIndex) => {
    formData.append(`productImage_${productIndex}`, product.image);

    product.colors.forEach((color, colorIndex) => {
      formData.append(`product_${productIndex}_color_${colorIndex}`, color.color);
      formData.append(`product_${productIndex}_colorImage_${colorIndex}`, color.image);
      formData.append(`product_${productIndex}_sizes_${colorIndex}`, color.sizes.join(','));
    });
  });

  // Append selected categories
  Object.keys(selectedCategories).forEach((category) => {
    if (selectedCategories[category]) {
      formData.append(`category_${category}`, category);
    }
  });

  // Send data to backend
  try {
    const response = await fetch(`${getApiBaseUrl()}/bundle/add`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();

      alert('Bundle created successfully!');
    } else {
      console.error('Error creating bundle:', response.statusText);
      alert('Failed to create bundle. Please try again.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred. Please try again.');
  }
};