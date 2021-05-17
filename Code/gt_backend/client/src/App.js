import './App.css';
import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Meeting from './components/meeting/Meeting';
import ScheduleMeeting from './components/meeting/ScheduleMeeting.js';
import MeetingList from './components/meeting/MeetingList.js';
import Calendar from './components/schedule/Calendar.tsx';
import { Provider } from 'react-redux';
import store from './sandbox/store';
import Alert from './components/layout/Alert';
import { loadUser } from './sandbox/actions/auth';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import AllClassrooms from './pages/AllClassrooms';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Testing from './components/testing/Testing';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavBar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/meeting' component={Meeting} />
              <Route
                exact
                path='/meeting/schedule'
                component={ScheduleMeeting}
              />
              <Route exact path='/meetings' component={MeetingList} />
              <PrivateRoute exact path='/dashboard' component={Calendar} />
              <PrivateRoute path='/classroom' component={AllClassrooms} />

              <PrivateRoute exact path='/profile' component={Profile} />
              {/* TODO build not found page*/}
              <Route exact path='/test' component={Testing} />
              <Route path='*'>
                <NotFound />
              </Route>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
