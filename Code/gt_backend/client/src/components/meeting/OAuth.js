import React from 'react';

export const OAuth = () => {
  return (
    <div>
      {/* get button from Zoom sample from Create app */}
      {/* link: https://zoom.us/oauth/authorize?response_type=code&client_id=pjqdk2rYRYC13CVvVXT7ag&redirect_uri=http%3A%2F%2Flocalhost%3A3000 */}
      <a
        href='https://zoom.us/oauth/authorize?response_type=code&client_id=pjqdk2rYRYC13CVvVXT7ag&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fprofile'
        target='_blank'
        rel='noopener noreferrer'
      >
        <img
          src='https://marketplacecontent.zoom.us/zoom_marketplace/img/add_to_zoom.png'
          height='32'
          alt='Add to ZOOM'
        />
      </a>
    </div>
  );
};

export default OAuth;
