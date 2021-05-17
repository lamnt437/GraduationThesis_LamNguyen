import React, { useEffect, useState } from 'react';
import getAccessToken from '../../utils/oauth_token';

export const Testing = () => {
  const [meetingInfo, setMeetingInfo] = useState({
    topic: 'hello',
    isRecurring: false,
  });

  const { isRecurring } = meetingInfo;

  const onChange = (e) => {
    console.log({ meetingInfo });
    setMeetingInfo({ ...meetingInfo, isRecurring: !isRecurring });
  };

  return (
    <div>
      <form>
        <div>
          <input type='checkbox' onChange={(e) => onChange(e)} />
        </div>
      </form>
    </div>
  );
};
export default Testing;
