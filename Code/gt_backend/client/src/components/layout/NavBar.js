import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../sandbox/actions/auth';

const NavBar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const guestLinks = (
    <Fragment>
      <ul>
        <li>
          <Link to='/register'>Đăng ký</Link>
        </li>
        <li>
          <Link to='/login'>Đăng nhập</Link>
        </li>
      </ul>
    </Fragment>
  );

  const authLinks = (
    <Fragment>
      <ul>
        <li>
          <Link to='/dashboard'>Dashboard</Link>
        </li>
        <li>
          <Link to='/classroom'>Lớp học</Link>
        </li>
        <li>
          <Link to='/meeting'>Meeting</Link>
        </li>
        <li>
          <Link to='/profile'>Hồ sơ cá nhân</Link>
        </li>
        <li>
          <a href='#!' onClick={logout}>
            Đăng xuất
          </a>
        </li>
      </ul>
    </Fragment>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code' /> ClassZoom
        </Link>
      </h1>
      {/* null so can use this syntax */}
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks} </Fragment>
      )}
    </nav>
  );
};

NavBar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(NavBar);
