import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerDashboard from "../components/sellerDashboard";
import { getApiBaseUrl } from '../utils/config';

const SellPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  // const apiUrl = import.meta.env.VITE_API_BASE_URL; 

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {

        const response = await fetch(`${getApiBaseUrl()}/auth/isAdmin`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();


        if (data.success) {
          setIsAdmin(true);
        } else {

          navigate("/admin/login");
        }
      } catch (error) {

        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <SellerDashboard />
    </div>
  );
};

export default SellPage;
