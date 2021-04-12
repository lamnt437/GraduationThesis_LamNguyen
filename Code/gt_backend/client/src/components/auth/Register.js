import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setAlert } from '../../sandbox/actions/alert';
import {
  setRegisterSuccess,
  setRegisterFail,
} from '../../sandbox/actions/auth';
import PropTypes from 'prop-types';

export const Register = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      // console.log("Not match");
      props.setAlert('password not match', 'danger');
    } else {
      // create user object
      // stringify
      // config
      // send request in a try catch
      const newUser = {
        name,
        email,
        password,
      };

      // add to proxy
      const url = '/api/users';

      const body = JSON.stringify(newUser);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        const res = await axios.post(url, body, config);
        console.log(res.data);
        props.setRegisterSuccess(
          "You've successfully registered a new account",
          'success',
          3000
        );
      } catch (err) {
        console.error(err.response.data);
        props.setRegisterFail(err.response.data.errors, 'danger', 3000);
      }
    }
  };

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
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            required
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
            required
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
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <a href='login.html'>Sign In</a>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  setRegisterFail: PropTypes.func.isRequired,
  setRegisterSuccess: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, setRegisterFail, setRegisterSuccess })(
  Register
);
// function connect to connect to redux
