import classes from './css/ClassItem.module.css';
import { useHistory } from 'react-router-dom';

const ClassItem = (props) => {
  const history = useHistory();
  const onClickHandler = (e) => {
    history.push(`/classroom/${props.id}`);
  };
  return (
    <li
      className={classes.item}
      style={{ cursor: 'pointer' }}
      onClick={(e) => onClickHandler(e)}
    >
      <figure>
        <blockquote>
          <p>{props.name}</p>
        </blockquote>
        <figcaption>{props.description}</figcaption>
      </figure>
    </li>
  );
};

export default ClassItem;
