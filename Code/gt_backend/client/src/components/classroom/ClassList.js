import React, { Component, Fragment } from 'react';
import { fetchClassRoom } from '../../services/classroom';
import ClassOverview from './ClassOverview';

//

class ClassList extends Component {
  state = {
    classrooms: [],
  };

  async componentDidMount() {
    // load all class of this member
    // how to use lookup?
    // need to get state of this app about current user, user id to make query to the server
    // => need to finish login function
    const res = await fetchClassRoom();
    this.setState({ classrooms: res.data.classrooms });
    // console.log(classrooms);
    console.log(this.state.classrooms);
  }

  render() {
    return (
      <Fragment>
        {this.state.classrooms ? (
          this.state.classrooms.map((classroom) => (
            <ClassOverview item={classroom} />
          ))
        ) : (
          <h1>No class to display</h1>
        )}
      </Fragment>
    );
  }
}

export default ClassList;
