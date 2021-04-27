import React, { useEffect } from 'react';
import getAccessToken from '../../utils/oauth_token';

export const Testing = () => {
  useEffect(() => {
    getAccessToken();
  }, []);
  return <div></div>;
};
export default Testing;
