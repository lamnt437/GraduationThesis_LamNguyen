import React, { Fragment, useState, useEffect } from 'react';
import { useHistory, useRouteMatch, Route, Switch } from 'react-router-dom';
import { fetchClassRooms } from '../services/classroom';
import ClassList from '../components/classroom/ClassList';
import ClassCreate from '../components/classroom/ClassCreate';
import classes from './css/AllClassroom.module.css';
import ClassDetail from './ClassDetail';

const AllClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const history = useHistory();
  const match = useRouteMatch();

  /* Dummy data */
  const classroomArray = [
    {
      _id: 'abc',
      name: 'First Class',
      description: 'Class for Elite student',
    },

    {
      _id: 'abc',
      name: 'Second Class',
      description: 'Class for almost Elite student',
    },
  ];

  const onCreateHandler = (e) => {
    e.preventDefault();
    history.push(`${match.url}/create`);
  };

  useEffect(async () => {
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
          <button onClick={(e) => onCreateHandler(e)} type='submit'>
            Tạo lớp mới
          </button>
          <ClassList classrooms={classrooms} />
        </div>
      </Route>

      <Route path={`${match.url}/create`} exact>
        <ClassCreate />
      </Route>

      <Route path={`${match.url}/:id`}>
        <ClassDetail />
      </Route>
    </Switch>
  );
};

export default AllClassrooms;
