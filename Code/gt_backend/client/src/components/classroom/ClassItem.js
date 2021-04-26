import React, { Fragment } from 'react';
import classes from './css/ClassItem.module.css';
import { Link } from 'react-router-dom';
// import './css/classi.css';

const ClassItem = (props) => {
  return (
    <li className={classes.item}>
      <figure>
        <blockquote>
          <p>{props.name}</p>
        </blockquote>
        <figcaption>{props.description}</figcaption>
      </figure>
      <Link to={`/classroom/${props.id}`}>View Fullscreen</Link>
    </li>
  );
};

export default ClassItem;
