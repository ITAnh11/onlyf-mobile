import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';

let hasHandledInitialURL = false;

export const useSearchParams = () => {
  const [params, setParams] = useState<Record<string, string>>({});

  const handleUrl = (urlString: string) => {
    const url = new URL(urlString);
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    setParams(queryParams);
  };

  useEffect(() => {
    const sub = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    if (!hasHandledInitialURL) {
      hasHandledInitialURL = true;
      Linking.getInitialURL().then((url) => {
        if (url) handleUrl(url);
      });
    }

    return () => {
      sub.remove();
    };
  }, []);

  const clearParams = () => setParams({});
  return { params, clearParams };
};