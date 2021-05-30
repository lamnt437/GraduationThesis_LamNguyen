import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../sandbox/actions/alert';
import { register } from '../../sandbox/actions/auth';
import { ROLE_TEACHER, ROLE_STUDENT } from '../../constants/constants';
import PropTypes from 'prop-types';
import { FormatIndentDecreaseTwoTone } from '@material-ui/icons';

export const Register = (props) => {
  // TODO add teacher role
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: ROLE_STUDENT,
  });

  const { name, email, password, password2, role } = formData;

  const [isTeacher, setIsTeacher] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onChangeRole = (e) => {
    const newIsTeacher = !isTeacher;
    // console.log({ meetingInfo });
    if (newIsTeacher) {
      setFormData({
        ...formData,
        role: ROLE_TEACHER,
      });
      setIsTeacher(true);
    } else {
      setFormData({
        ...formData,
        role: ROLE_STUDENT,
      });
      setIsTeacher(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      props.setAlert('password not match', 'danger');
    } else {
      props.register(name, email, password, role);
    }
  };

  if (props.isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='role'>Bạn là giáo viên?</label>
          <input
            type='checkbox'
            name='role'
            defaultChecked={isTeacher}
            onChange={(e) => onChangeRole(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account?{' '}
        <Link to='/login' className='btn btn-light'>
          Login
        </Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProp = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProp, { setAlert, register })(Register);
// function connect to connect to redux
