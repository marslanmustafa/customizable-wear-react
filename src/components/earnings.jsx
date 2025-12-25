import React, { useState, useEffect } from "react";
import { useToast } from '@/components/ui/use-toast';

const Earnings = ({ setTotalEarnings }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarningsLocal] = useState(0); // Local state for total earnings
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { toast } = useToast();
  // Fetch total earnings from the API
  const fetchEarnings = async () => {
    try {
      

      const response = await fetch(`${apiUrl}/orders/earnings`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch earnings");
      }

      const data = await response.json();

      if (data.success && typeof data.totalEarnings === "number") {
        setTotalEarningsLocal(data.totalEarnings); // Update local state
        if (typeof setTotalEarnings === "function") {
          setTotalEarnings(data.totalEarnings); // Update total earnings in the parent component
        }
      } else {
       toast({
					description: '"Unexpected response format from API"',
					variant: 'destructive',
					className: 'bg-red-500 text-white border-0',
				});
      }
    } catch (error) {
      
      setError("Failed to fetch earnings");
        toast({
					description: error.message || 'Failed to fetch earnings',
					variant: 'destructive',
					className: 'bg-red-500 text-white border-0',
				});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Earnings</h1>

      {/* Total Earnings Card */}
      <div className="bg-orange-300 text-gray-900 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium">Total Earnings</h2>
        <p className="text-4xl font-bold mt-2">
          ${totalEarnings.toLocaleString()}
        </p>
      </div>

    </div>
  );
};

export default Earnings;