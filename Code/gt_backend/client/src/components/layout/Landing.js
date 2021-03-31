import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Fragment>
      <section class="landing">
        <div class="dark-overlay">
          <div class="landing-inner">
            <h1 class="x-large">Zoom Class</h1>
            <p class="lead">Create a class and start teaching now!</p>
            <div class="buttons">
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-light">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Landing;
