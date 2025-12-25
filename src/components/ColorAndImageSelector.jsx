import React, { useState } from 'react';

const ColorAndImageSelector = ({ product, selectedColor, onColorSelect, showImages, onProductSelect }) => {
	if (!product) return null;

	// Step 1: Select color
	const colors = product.colors || [];
	const [selectedImage, setSelectedImage] = useState(null);

	const handleImageSelect = (imageUrl) => {
		setSelectedImage(imageUrl);
		onProductSelect({
			...product,
			selectedColor,
			selectedImage: imageUrl
		});
	};

	return (
		<div>
			<h3 className="text-md font-medium mb-2 text-gray-800">Choose a Color</h3>
			<div className="flex gap-2 mb-4 flex-wrap">
				{colors.map((c, index) => (
					<button
						key={index}
						className={`w-10 h-10 rounded-full border-2 ${
							selectedColor === c.color ? 'border-blue-600' : 'border-gray-300'
						}`}
						style={{ backgroundColor: c.color }}
						onClick={() => onColorSelect(c.color)}
					/>
				))}
			</div>

			{/* Step 2: Show product images for the selected color */}
			{showImages && (
				<>
					<h3 className="text-md font-medium mb-2 text-gray-800">Select Image</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
						{product.images?.[selectedColor]?.map((imgUrl, index) => (
							<img
								key={index}
								src={imgUrl}
								alt="Product"
								className={`rounded-lg cursor-pointer border-2 p-1 ${
									selectedImage === imgUrl ? 'border-blue-600' : 'border-transparent'
								}`}
								onClick={() => handleImageSelect(imgUrl)}
							/>
						)) || (
							<p className="text-gray-500 text-sm col-span-2">No images found for this color</p>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ColorAndImageSelector;
