import classes from './ChannelItem.module.css';

const onClickHandler = (e) => {};

const ChannelItem = ({ title }) => {
  return (
    <div className={classes.channelItem} onClick={(e) => onClickHandler(e)}>
      <h4>{title}</h4>
    </div>
  );
};

export default ChannelItem;
