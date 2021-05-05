import React from 'react';
import './Header.css';
import logo from './img/ClassZoom.png';

import { NavLink, useRouteMatch } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import FlagIcon from '@material-ui/icons/Flag';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import StorefrontOutlinedIcon from '@material-ui/icons/StorefrontOutlined';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { Avatar, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ForumIcon from '@material-ui/icons/Forum';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export const Header = () => {
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
        <div className='header__option header__option--active'>
          <HomeIcon fontSize='large' />
          {/* TODO navigation link in header*/}
          {/* TODO members/meetings/feeds/tasks/material */}
          {/* load all posts, meetings, members and fill into redux store */}
          {/* load class overview vs load class detail */}
        </div>
        <div className='header__option'>
          <FlagIcon fontSize='large' />
          <NavLink to='/classroom/:id/task'></NavLink>
        </div>
        <div className='header__option'>
          <SubscriptionsOutlinedIcon fontSize='large' />
        </div>
        <div className='header__option'>
          <StorefrontOutlinedIcon fontSize='large' />
        </div>
        <div className='header__option'>
          <SupervisedUserCircleIcon fontSize='large' />
          <NavLink to='/classroom/:id/member'></NavLink>
        </div>
      </div>
      <div className='header__right'>
        <div className='header__info'>
          <Avatar />
          <h4>Lam Nguyen</h4>
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

export default Header;
