import { useEffect, useRef, useState } from 'react';
import * as Linking from 'expo-linking';

type SearchParams = {
  username?: string;
  [key: string]: string | undefined;
};

let hasHandledInitialURL = false;

export const useSearchParams = () => {
  const [params, setParams] = useState<SearchParams>({});

  const handleUrl = (urlString: string) => {
    const url = new URL(urlString);
    const queryParams: SearchParams = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    setParams(queryParams);
  };

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    if (!hasHandledInitialURL) {
      hasHandledInitialURL = true;
      Linking.getInitialURL().then((url) => {
        if (url) {
          handleUrl(url);
        }
      });
    }

    return () => {
      subscription.remove();
    };
  }, []);

  const clearParams = () => {
    setParams({});
  };

  return { params, clearParams };
};
