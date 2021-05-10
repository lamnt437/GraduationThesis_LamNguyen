import { useRouteMatch, useHistory } from 'react-router-dom';
import './SidebarRow.css';
import { Avatar } from '@material-ui/core';

export const SidebarRow = ({ src, Icon, title, name }) => {
  const history = useHistory();
  const match = useRouteMatch();

  const onClickHandler = (e) => {
    e.preventDefault();
    console.log(`${name} clicked`);
    history.push(`${match.url}/${name.toLowerCase()}`);
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
