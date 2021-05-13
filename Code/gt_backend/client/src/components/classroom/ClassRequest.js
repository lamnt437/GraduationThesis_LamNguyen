import { requestClassroom } from '../../services/classroom';
import classes from './css/ClassItem.module.css';

const ClassRequest = ({ name, description, classId }) => {
  const requestButtonClickHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await requestClassroom(classId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li className={classes.item}>
      <figure>
        <blockquote>
          <p>{name}</p>
        </blockquote>
        <figcaption>{description}</figcaption>
      </figure>
      <button onClick={(e) => requestButtonClickHandler(e)}>
        Request to join
      </button>
    </li>
  );
};

export default ClassRequest;
