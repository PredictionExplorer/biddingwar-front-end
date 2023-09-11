import React, { useEffect } from 'react';
import { useApiData } from './ApiDataContext';
import { useActiveWeb3React } from '../hooks/web3';

interface ApiDataFetcherProps {
  interval: number;
}

const ApiDataFetcher: React.FC<ApiDataFetcherProps> = ({ interval }) => {
  const { setApiData } = useApiData();
  const { account } = useActiveWeb3React();
  const fetchNotification = async () => {
    const res = await fetch(`/api/notifRedBox?address=${account}`);
    const notify = await res.json();
    return notify;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        const newData = await fetchNotification();
        setApiData(newData);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [interval, setApiData]);

  return null;
};

export default ApiDataFetcher;