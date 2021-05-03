import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { zoomfunc } from '../../services/zoom';

const ProfileOAuth = ({ code }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    // send code to server to process getting token
    try {
      const response = await zoomfunc(code);
      console.log(response);
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  }, []);
  return isLoading ? <div>Loading...</div> : <Redirect to='/profile' />;
};

export default ProfileOAuth;
