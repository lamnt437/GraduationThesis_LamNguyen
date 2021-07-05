import './Header.css';

import { useRouteMatch, useHistory } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import FlagIcon from '@material-ui/icons/Flag';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { Avatar, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ForumIcon from '@material-ui/icons/Forum';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import TodayIcon from '@material-ui/icons/Today';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export const Header = ({ username }) => {
  return (
    <div className='header'>
      <div className='header__left'>
        {/* <img src={logo} /> */}
        <div className='header__input'>
          <SearchIcon />
          <input type='text' />
        </div>
      </div>
      <div className='header__center'>
        <HeaderOption Icon={HomeIcon} title='home' />
        <HeaderOption Icon={TodayIcon} title='calendar' />
        <HeaderOption Icon={SubscriptionsOutlinedIcon} title='meetings' />
        <HeaderOption Icon={SupervisedUserCircleIcon} title='members' />
      </div>
      <div className='header__right'>
        <div className='header__info'>
          <Avatar />
          <h4>{username}</h4>
        </div>

        <IconButton>
          <AddIcon />
        </IconButton>
        <IconButton>
          <ForumIcon />
        </IconButton>
        <IconButton>
          <NotificationsActiveIcon />
        </IconButton>
        <IconButton>
          <ExpandMoreIcon />
        </IconButton>
      </div>
    </div>
  );
};

const HeaderOption = ({ Icon, title }) => {
  const match = useRouteMatch();
  const history = useHistory();

  const onClickHandler = (e) => {
    e.preventDefault();
    console.log(title + ' clicked');
    history.push(`${match.url}/${title}`);
  };

  return (
    <div
      className='header__option header__option'
      onClick={(e) => onClickHandler(e)}
    >
      {Icon && <Icon fontSize='large' />}
    </div>
  );
};

export default Header;
