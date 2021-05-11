import React, { Fragment, useState, useEffect } from 'react';
import { useHistory, useRouteMatch, Route, Switch } from 'react-router-dom';
import { fetchClassRooms } from '../services/classroom';
import ClassList from '../components/classroom/ClassList';
import ClassCreate from '../components/classroom/ClassCreate';
import ClassFind from '../components/classroom/ClassFind';
import classes from './css/AllClassroom.module.css';
import ClassDetail from './ClassDetail';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROLE_TEACHER } from '../constants/constants';

const AllClassrooms = ({ user }) => {
  const [classrooms, setClassrooms] = useState([]);
  const history = useHistory();
  const match = useRouteMatch();

  const onCreateHandler = (e) => {
    e.preventDefault();
    history.push(`${match.url}/create`);
  };

  const onFindHandler = (e) => {
    e.preventDefault();
    history.push(`${match.url}/find`);
  };

  useEffect(async () => {
    console.log({ user });
    try {
      const res = await fetchClassRooms();
      console.log(res.data);
      setClassrooms(res.data.classrooms);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  return (
    // <PrivateRoute path='/clasroom/create' component={ClassCreate} />
    //           <PrivateRoute path='/classroom/:id' component={ClassDetail} />

    // Route list
    // Route create
    // Route detail
    <Switch>
      <Route path={match.url} exact>
        <div className={classes.allclassrooms_container}>
          <h1>Tất cả các lớp</h1>
          {isTeacher(user) ? (
            <button onClick={(e) => onCreateHandler(e)} type='submit'>
              Tạo lớp mới
            </button>
          ) : (
            <button onClick={(e) => onFindHandler(e)} type='submit'>
              Tìm lớp học
            </button>
          )}

          <ClassList classrooms={classrooms} />
        </div>
      </Route>

      {isTeacher(user) ? (
        <Route path={`${match.url}/create`} exact>
          <ClassCreate />
        </Route>
      ) : (
        ''
      )}

      <Route path={`${match.url}/find`} exact>
        <ClassFind />
      </Route>

      <Route path={`${match.url}/:id`}>
        <ClassDetail />
      </Route>
    </Switch>
  );
};

AllClassrooms.propTypes = {
  user: PropTypes.object,
};

const isTeacher = (user) => {
  if (user.role === ROLE_TEACHER) {
    return true;
  } else {
    return false;
  }
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(AllClassrooms);
