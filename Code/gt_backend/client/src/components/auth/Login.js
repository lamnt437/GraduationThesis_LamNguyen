import React, { Fragment, useState } from "react";
import axios from "axios";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const url = "/api/auth";

    const user = {
      email,
      password,
    };

    const body = JSON.stringify(user);

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
  };

  const { email, password } = formData;
  return (
    <Fragment>
      <div class="alert alert-danger">Invalid credentials</div>
      <h1 class="large text-primary">Sign In</h1>
      <p class="lead">
        <i class="fas fa-user"></i> Sign into Your Account
      </p>
      <form class="form" onSubmit={(e) => onSubmit(e)}>
        <div class="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" class="btn btn-primary" value="Login" />
      </form>
      <p class="my-1">
        Don't have an account? <a href="register.html">Sign Up</a>
      </p>
    </Fragment>
  );
};

export default Login;
