import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getFetch = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const resData = await response.json();
        setData(resData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getFetch();
  }, [url]);

  return { loading, data };
};
