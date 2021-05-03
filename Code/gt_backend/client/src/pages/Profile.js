import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileComponent from '../components/profile/Profile.js';
import ProfileOAuth from '../components/profile/ProfileOAuth';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Profile = () => {
  let query = useQuery();

  return (
    <div>
      <h1>Profile page</h1>
      <div>
        <Child code={query.get('code')} />
      </div>
    </div>
  );
};

const Child = ({ code }) => {
  return (
    <div>{code ? <ProfileOAuth code={code} /> : <ProfileComponent />}</div>
  );
};

export default Profile;
