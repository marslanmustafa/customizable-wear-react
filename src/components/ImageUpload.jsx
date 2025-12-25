// import React from 'react';

// const ImageUpload = ({ onUpload, handleColorImageChange, productIndex, colorIndex, products, setProducts }) => {
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       onUpload(file); // Pass the file to the parent component
//     }
//   };

//   return (
//     <div className="mb-4">
//       <h1 className="text-xl">Product Image</h1>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) =>
//           handleColorImageChange(e, productIndex, colorIndex, products, setProducts)
//         }
//         className="border border-gray-300 p-2 rounded-md w-full mt-2"
//       />
//     </div>
//   );
// };

// export default ImageUpload;