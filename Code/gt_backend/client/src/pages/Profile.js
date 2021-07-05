import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileComponent from '../components/profile/Profile.js';
import ProfileOAuth from '../components/profile/ProfileOAuth';
import styles from './css/Profile.module.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Profile = () => {
  let query = useQuery();

  return (
    <div className={styles.profile_container}>
      <h1>Hồ sơ</h1>
      <div className={styles.profile_item}>
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
