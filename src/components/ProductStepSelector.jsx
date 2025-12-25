import React, { useState } from 'react';
import ColorAndImageSelector from './ColorAndImageSelector';

const ProductStepSelector = ({ step, allProducts, selected, onSelect }) => {
	const [selectedColor, setSelectedColor] = useState(null);
	const [showImages, setShowImages] = useState(false);

	const handleColorPick = (color) => {
		setSelectedColor(color);
		setShowImages(true);
	};

	const currentProduct = allProducts[step]; // Mock logic, can change per need

	return (
		<div className="bg-white p-6 rounded shadow">
			<h2 className="text-xl font-semibold mb-4">Select Product {step + 1}</h2>

			<ColorAndImageSelector
				product={currentProduct}
				onColorSelect={handleColorPick}
				selectedColor={selectedColor}
				showImages={showImages}
				onProductSelect={(finalProduct) => onSelect(finalProduct)}
			/>
		</div>
	);
};

export default ProductStepSelector;
