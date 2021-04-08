import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Fragment>
      <nav class="navbar bg-dark">
        <h1>
          <Link to="/">
            <i class="fas fa-code"></i> Zoom Class
          </Link>
        </h1>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/class">Classes</Link>
          </li>
          <li>
            <Link to="/meeting">Meeting</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

export default NavBar;
