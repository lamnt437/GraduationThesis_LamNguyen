import React, { useState, useEffect } from 'react';
import { fetchMyProfile } from '../../services/profile.ts';
import { Avatar } from '@material-ui/core';
import OAuth from '../meeting/OAuth';

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
  let render = <div>Loading....</div>;
  if (!isLoading) {
    if (hasError) {
      render = <div>Profile loading error</div>;
    } else {
      render = (
        <div>
          <Avatar src={`http:${profile.avatar}`} />
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
          <p>{profile.role == 2 ? 'Teacher' : 'Student'}</p>
          <OAuth />
        </div>
      );
    }
  }
  return render;
};

export default Profile;
