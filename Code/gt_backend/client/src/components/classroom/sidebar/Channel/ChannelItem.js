import { useHistory } from 'react-router-dom';
import classes from './ChannelItem.module.css';

const ChannelItem = ({ topic, classId }) => {
  const history = useHistory();

  const onClickHandler = (e) => {
    e.preventDefault();
    history.push(`/classroom/${classId}/feed?topic=${topic._id}`);
  };

  return (
    <div className={classes.channelItem} onClick={(e) => onClickHandler(e)}>
      <h4>{topic.text}</h4>
    </div>
  );
};

export default ChannelItem;
