import React, { Fragment, useState, useEffect } from 'react';
import { useHistory, useRouteMatch, Route, Switch } from 'react-router-dom';
import ClassList from '../components/classroom/ClassList';
import ClassFind from '../components/classroom/ClassFind';
import classes from './css/AllClassroom.module.css';
import ClassDetail from './ClassDetail';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from '../components/layout/Modal';
import PageHeader from '../components/layout/PageHeader';
import { ROLE_TEACHER } from '../constants/constants';
import { makeStyles, Paper } from '@material-ui/core';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ClassCreateForm from '../components/classroom/ClassCreateForm';
import Loading from '../components/layout/Loading';
import { getClassrooms } from '../sandbox/actions/classroom';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    boxShadow: 'none',
  },
}));

const AllClassrooms = ({
  user,
  classroom: { classrooms, loading },
  getClassrooms,
}) => {
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const match = useRouteMatch();
  const componentClasses = useStyles();

  const toggleShowModal = () => {
    setShowModal((prev) => !prev);
  };

  const onFindHandler = (e) => {
    e.preventDefault();
    history.push(`${match.url}/find`);
  };

  useEffect(() => {
    getClassrooms();
  }, [getClassrooms]);

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <PageHeader
          title='Tạo lớp học mới'
          subTitle='Quản lý lớp học dễ dàng với ClassZoom!'
          icon={<SupervisedUserCircleIcon fontSize='large' />}
        />
        <Paper className={componentClasses.pageContent}>
          <ClassCreateForm setShowModal={setShowModal} />
        </Paper>
      </Modal>

      <Switch>
        <Route path={match.url} exact>
          <div className={classes.allclassrooms_container}>
            <h1>Tất cả các lớp</h1>
            {isTeacher(user) ? (
              <button onClick={(e) => toggleShowModal(e)} type='submit'>
                Tạo lớp mới
              </button>
            ) : (
              <button onClick={(e) => onFindHandler(e)} type='submit'>
                Tìm lớp học
              </button>
            )}

            {loading ? <Loading /> : <ClassList classrooms={classrooms} />}
          </div>
        </Route>

        <Route path={`${match.url}/find`} exact>
          <ClassFind />
        </Route>

        <Route path={`${match.url}/:id`} component={ClassDetail} />
      </Switch>
    </>
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

AllClassrooms.propTypes = {
  getClassrooms: PropTypes.func.isRequired,
  classroom: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  classroom: state.classroom,
});

export default connect(mapStateToProps, { getClassrooms })(AllClassrooms);
