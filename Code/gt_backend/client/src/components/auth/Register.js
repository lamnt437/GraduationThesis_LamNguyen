import React, { Fragment, useState } from "react";
import axios from "axios";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log("Not match");
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
      const url = "/api/users";

      const body = JSON.stringify(newUser);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await axios.post(url, body, config);
        console.log(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    }
  };

  return (
    <Fragment>
      <h1 class="large text-primary">Sign Up</h1>
      <p class="lead">
        <i class="fas fa-user"></i> Create Your Account
      </p>
      <form class="form" onSubmit={(e) => onSubmit(e)}>
        <div class="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div class="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            required
            onChange={(e) => onChange(e)}
          />
          <small class="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" class="btn btn-primary" value="Register" />
      </form>
      <p class="my-1">
        Already have an account? <a href="login.html">Sign In</a>
      </p>
    </Fragment>
  );
};

export default Register;
