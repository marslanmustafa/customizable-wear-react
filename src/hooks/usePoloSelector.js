import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl } from '../utils/config';

export const usePoloSelector = () => {
  const { id } = useParams();
  const [bundle, setBundle] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // First product states
  const [selectedPoloShirts1, setSelectedPoloShirts1] = useState([]);
  const [selectedColors1, setSelectedColors1] = useState([]);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isPoloShirtsOpen1, setIsPoloShirtsOpen1] = useState(true);
  const [quantities1, setQuantities1] = useState({});
  const [totalSelectedSizes1, setTotalSelectedSizes1] = useState(0);

  // Second product states
  const [selectedPoloShirts2, setSelectedPoloShirts2] = useState([]);
  const [selectedColors2, setSelectedColors2] = useState([]);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [isPoloShirtsOpen2, setIsPoloShirtsOpen2] = useState(false);
  const [quantities2, setQuantities2] = useState({});
  const [totalSelectedSizes2, setTotalSelectedSizes2] = useState(0);

  // Third product states
  const [selectedPoloShirts3, setSelectedPoloShirts3] = useState([]);
  const [selectedColors3, setSelectedColors3] = useState([]);
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false);
  const [isPoloShirtsOpen3, setIsPoloShirtsOpen3] = useState(false);
  const [quantities3, setQuantities3] = useState({});
  const [totalSelectedSizes3, setTotalSelectedSizes3] = useState(0);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${getApiBaseUrl()}/bundle/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        if (!data.bundle) {
          throw new Error("Bundle data not found in response");
        }

        const transformedProducts = data.bundle.products.map(product => ({
          ...product,
          id: product._id || product.bundleProductId
        }));

        setBundle(data.bundle);
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching bundle:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
    fetchBundle();
  }, [id]);

  // Get the maximum allowed quantity based on bundle type and product position
  const getMaxQuantity = (sectionNumber) => {
    if (!bundle?.type) return 0;

    switch (bundle.type.toLowerCase()) {
      case 'everyday':
        return sectionNumber === 1 ? 5 :
          sectionNumber === 2 ? 3 :
            2;
      case 'solo1':
      case 'solo2':
        return sectionNumber === 1 ? 3 : 2;
      default:
        return 0;
    }
  };

  // Common quantity change handler for all products
  const handleQuantityChange = (sectionNumber, size, delta, color) => {
    const key = `${color}-${size}`;
    const maxQuantity = getMaxQuantity(sectionNumber);

    const updateState = {
      1: {
        quantities: quantities1,
        setQuantities: setQuantities1,
        totalSelected: totalSelectedSizes1,
        setTotalSelected: setTotalSelectedSizes1
      },
      2: {
        quantities: quantities2,
        setQuantities: setQuantities2,
        totalSelected: totalSelectedSizes2,
        setTotalSelected: setTotalSelectedSizes2
      },
      3: {
        quantities: quantities3,
        setQuantities: setQuantities3,
        totalSelected: totalSelectedSizes3,
        setTotalSelected: setTotalSelectedSizes3
      }
    }[sectionNumber];

    updateState.setQuantities(prev => {
      const newQuantity = Math.max(0, (prev[key] || 0) + delta);
      const newTotal = updateState.totalSelected + delta;

      // Enforce maximum quantity for the section
      if (newTotal <= maxQuantity || maxQuantity === 0) {
        updateState.setTotalSelected(newTotal);
        return { ...prev, [key]: newQuantity };
      }
      return prev;
    });
  };


  const calculateTotalSizes = (quantities) => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const resetSelections = () => {
    setSelectedPoloShirts1([]);
    setSelectedColors1([]);
    setIsDropdownOpen1(false);
    setIsPoloShirtsOpen1(true);
    setQuantities1({});
    setTotalSelectedSizes1(0);

    setSelectedPoloShirts2([]);
    setSelectedColors2([]);
    setIsDropdownOpen2(false);
    setIsPoloShirtsOpen2(false);
    setQuantities2({});
    setTotalSelectedSizes2(0);

    setSelectedPoloShirts3([]);
    setSelectedColors3([]);
    setIsDropdownOpen3(false);
    setIsPoloShirtsOpen3(false);
    setQuantities3({});
    setTotalSelectedSizes3(0);
  };

  // First product handlers
  const handleSelectProduct1 = (product) => {
    if (selectedPoloShirts1.length < 1) {
      setSelectedPoloShirts1([product]);
    }
  };

  const handleColorChange1 = (color, sectionNumber = 1) => {
    setSelectedColors1(prev => {
      const maxColors = (bundle?.type?.toLowerCase() === 'everyday' && sectionNumber === 1) ? 3 :
        (sectionNumber === 1 ? 5 :
          sectionNumber === 2 ? 2 : 1);

      return prev.includes(color)
        ? prev.filter(c => c !== color)
        : prev.length < maxColors ? [...prev, color] : prev;
    });
  };


  const handleQuantityChange1 = (size, delta, color) => {
    handleQuantityChange(1, size, delta, color);
  };

  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };

  const togglePoloShirtsSection1 = () => {
    setIsPoloShirtsOpen1(!isPoloShirtsOpen1);
  };

  // Second product handlers
  const handleSelectProduct2 = (product) => {
    if (selectedPoloShirts2.length < 1) {
      setSelectedPoloShirts2([product]);
    }
  };

  const handleColorChange2 = (color, sectionNumber = 2) => {
    setSelectedColors2(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : prev.length < 3 ? [...prev, color] : prev
    );
  };

  const handleQuantityChange2 = (size, delta, color, sectionNumber = 3) => {
    handleQuantityChange(2, size, delta, color);
  };

  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const togglePoloShirtsSection2 = () => {
    setIsPoloShirtsOpen2(!isPoloShirtsOpen2);
  };

  // Third product handlers
  const handleSelectProduct3 = (product) => {
    if (selectedPoloShirts3.length < 1) {
      setSelectedPoloShirts3([product]);
    }
  };

  const handleColorChange3 = (color) => {
    setSelectedColors3(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : prev.length < 2 ? [...prev, color] : prev
    );
  };

  const handleQuantityChange3 = (size, delta, color) => {
    handleQuantityChange(3, size, delta, color);
  };

  const toggleDropdown3 = () => {
    setIsDropdownOpen3(!isDropdownOpen3);
  };

  const togglePoloShirtsSection3 = () => {
    setIsPoloShirtsOpen3(!isPoloShirtsOpen3);
  };

  return {
    bundle,
    products,
    loading,
    error,
    calculateTotalSizes,
    resetSelections,
    setBundle,

    // First product
    selectedPoloShirts1,
    selectedColors1,
    isDropdownOpen1,
    isPoloShirtsOpen1,
    quantities1,
    totalSelectedSizes1,
    handleSelectProduct1,
    handleColorChange1,
    handleQuantityChange1,
    toggleDropdown1,
    togglePoloShirtsSection1,

    // Second product
    selectedPoloShirts2,
    selectedColors2,
    isDropdownOpen2,
    isPoloShirtsOpen2,
    quantities2,
    totalSelectedSizes2,
    handleSelectProduct2,
    handleColorChange2,
    handleQuantityChange2,
    toggleDropdown2,
    togglePoloShirtsSection2,

    // Third product
    selectedPoloShirts3,
    selectedColors3,
    isDropdownOpen3,
    isPoloShirtsOpen3,
    quantities3,
    totalSelectedSizes3,
    handleSelectProduct3,
    handleColorChange3,
    handleQuantityChange3,
    toggleDropdown3,
    togglePoloShirtsSection3,

    // Helper function
    getMaxQuantity
  };
};