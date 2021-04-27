import React from 'react';
import classes from './css/ClassDetail.module.css';

export const ClassDetail = (props) => {
  return (
    <figure className={classes.classroom}>
      <p>{props.name}</p>
      <figcaption>{props.description}</figcaption>
    </figure>
  );
};

export default ClassDetail;
