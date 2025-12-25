import { useState, useEffect } from "react";

const useProductForm = (initialData) => {
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("In Stock");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [sideImage, setSideImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setProductTitle(initialData.title);
      setProductPrice(initialData.price);
      setProductStock(initialData.stock);
      setFrontImage(initialData.images?.front || null);
      setBackImage(initialData.images?.back || null);
      setSideImage(initialData.images?.side || null);
      setColors(initialData.colors || []);
      setImages(initialData.images?.extra || []);
    } else {
      setProductTitle("");
      setProductPrice("");
      setProductStock("In Stock");
      setFrontImage(null);
      setBackImage(null);
      setSideImage(null);
      setColors([]);
      setImages([]);
    }
  }, [initialData]);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "front") setFrontImage(file);
    if (type === "back") setBackImage(file);
    if (type === "side") setSideImage(file);
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert("You can upload up to 10 additional images only.");
      return;
    }
    setImages([...images, ...files]);
  };

  const removeExtraImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addColor = () => {
    setColors([...colors, ""]);
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index, value) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!frontImage || !backImage || !sideImage) {
//       alert("Please upload all three main images (front, back, side)!");
//       return;
//     }

//     // Validate colors: Ensure it is an array of non-empty strings
//     const validColors = colors.filter((color) => /^#[0-9A-Fa-f]{6}$/i.test(color.trim()));

//     return {
//       title: productTitle,
//       price: productPrice,
//       stock: productStock,
//       front: frontImage,
//       back: backImage,
//       side: sideImage,
//       images: images,
//       colors: validColors, // Only valid color codes will be submitted
//     };
//   };


const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!frontImage || !backImage || !sideImage) {
      alert("Please upload all three main images (front, back, side)!");
      return;
    }
  
    // Validate colors: Ensure it is an array of non-empty strings
    const validColors = colors.filter((color) => /^#[0-9A-Fa-f]{6}$/i.test(color.trim()));
  
    return {
      title: productTitle,
      price: productPrice,
      stock: productStock,
      front: frontImage,
      back: backImage,
      side: sideImage,
      images: images,
      colors: validColors, // Only valid color codes will be submitted
    };
  };
  


  return {
    productTitle,
    setProductTitle,
    productPrice,
    setProductPrice,
    productStock,
    setProductStock,
    frontImage,
    backImage,
    sideImage,
    images,
    colors,
    handleImageChange,
    handleExtraImagesChange,
    removeExtraImage,
    addColor,
    removeColor,
    updateColor,
    handleSubmit,
  };
};

export default useProductForm;
