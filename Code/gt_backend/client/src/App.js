import "./App.css";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Meeting from "./components/meeting/Meeting";
import ScheduleMeeting from "./components/meeting/ScheduleMeeting.js";
import MeetingList from "./components/meeting/MeetingList.js";

const App = () => {
  return (
    <Router>
      <Fragment>
        <NavBar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/meeting" component={Meeting} />
            <Route exact path="/meeting/schedule" component={ScheduleMeeting} />
            <Route exact path="/meetings" component={MeetingList} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
