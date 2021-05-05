import { EmojiFlags, Router } from '@material-ui/icons';
import React, { useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import './Sidebar.css';
import SidebarRow from './SidebarRow';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import StorefrontIcon from '@material-ui/icons/Storefront';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const Sidebar = ({ user }) => {
  return (
    // TODO after having designed sub Router, create navigation inside sidebar
    <div className='sidebar'>
      <SidebarRow src={user.avatar} title={user.name} />
      <SidebarRow Icon={EmojiFlagsIcon} title='Pages' />
      <SidebarRow Icon={PeopleIcon} title='Friends' />
      <SidebarRow Icon={ChatIcon} title='Messenger' />
      <SidebarRow Icon={StorefrontIcon} title='Marketplace' />
      <SidebarRow Icon={VideoLibraryIcon} title='Meetings' />
    </div>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps)(Sidebar);
