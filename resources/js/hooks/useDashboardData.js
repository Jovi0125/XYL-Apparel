import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useDashboardData() {
  const [data, setData] = useState({ orders: null, revenue: null, products: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/dashboard');
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30000); // poll every 30s
    return () => clearInterval(id);
  }, [fetchData]);

  const refresh = () => fetchData();

  return { data, loading, error, refresh };
}
