import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(url);
        setData(data.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    })();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(url);
      setData(data.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
