import React, { useState, useEffect } from 'react';
import { fetchMyProfile } from '../../services/profile.ts';
import { Avatar } from '@material-ui/core';
import OAuth from '../meeting/OAuth';
import Loading from '../layout/Loading';
import styles from './ProfileItem.module.css';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  // fetch profile
  useEffect(async () => {
    try {
      const response = await fetchMyProfile();
      setProfile(response.data.profile);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setHasError(true);
    }
  }, []);

  // copy template from mern stack
  let render = <Loading />;
  if (!isLoading) {
    if (hasError) {
      render = <div>Profile loading error</div>;
    } else {
      render = (
        <div className={styles.profileItem}>
          <div style={{ display: 'flex' }}>
            <Avatar
              src={`http:${profile.avatar}`}
              style={{ 'margin-right': '10px' }}
            />
            <h3>{profile.name}</h3>
          </div>
          <div style={{ 'margin-top': '15px' }}>
            <p>{profile.email}</p>
            <p>{profile.role == 2 ? 'Giáo viên' : 'Học sinh'}</p>
            <p style={{ 'font-family': 'Arial' }}>
              {profile.access_token
                ? 'Đã kết nối với Zoom Meeting'
                : 'Chưa kết nối với Zoom Meeting'}
            </p>
          </div>
          <div style={{ 'margin-top': '15px' }}>
            <OAuth />
          </div>
        </div>
      );
    }
  }
  return render;
};

export default Profile;
