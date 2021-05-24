import { Fragment } from 'react';
import ClassItem from './ClassItem';

const ClassList = (props) => {
  return (
    <Fragment>
      <ul>
        {Array.isArray(props.classrooms)
          ? props.classrooms.map((classroom) => (
              <ClassItem
                key={classroom._id}
                id={classroom._id}
                name={classroom.name}
                description={classroom.description}
              />
            ))
          : null}
      </ul>
    </Fragment>
  );
};

export default ClassList;
