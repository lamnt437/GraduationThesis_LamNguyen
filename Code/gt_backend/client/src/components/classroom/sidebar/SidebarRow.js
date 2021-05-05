import React from 'react';
import { useRouteMatch, useHistory, Link } from 'react-router-dom';
import './SidebarRow.css';
import { Avatar } from '@material-ui/core';

export const SidebarRow = ({ src, Icon, title }) => {
  const history = useHistory();
  const match = useRouteMatch();

  const onClickHandler = (e) => {
    e.preventDefault();
    console.log(`${title} clicked`);
    history.push(`${match.url}/${title.toLowerCase()}`);
  };

  return (
    <div className='sidebarRow' onClick={(e) => onClickHandler(e)}>
      {src && <Avatar src={src} />}
      {Icon && <Icon />}

      <h4>{title}</h4>
    </div>
  );
};
export default SidebarRow;
