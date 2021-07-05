import classes from './ChannelList.module.css';
import ChannelItem from './ChannelItem';
import styled from 'styled-components';
import styles from './ChannelList.module.css';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  addClassTopic,
  getClassTopics,
  resetClassTopics,
} from '../../../../sandbox/actions/topic';
import Loading from '../../../layout/Loading';
import { ROLE_TEACHER } from '../../../../constants/constants';

const AddButton = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: #2e81f4;
  border-radius: 10px;
  color: #fff;

  h4 {
    font-weight: 600;
    font-family: 'Arial';
  }
`;

const ChannelList = ({
  classId,
  topic: { topics, loading, error },
  user,
  addClassTopic,
  getClassTopics,
  resetClassTopics,
}) => {
  useEffect(() => {
    console.log('fetching topic');
    getClassTopics(classId);

    return () => {
      resetClassTopics();
    };
  }, [getClassTopics]);

  const [showList, setShowList] = useState(true);

  const onAddTopicHandler = (e) => {
    console.log('add topic');
  };

  const toggleChannelList = (e) => {
    setShowList(!showList);
  };
  return (
    <div className={classes.channellist_container}>
      <h3 style={{ cursor: 'pointer' }} onClick={(e) => toggleChannelList(e)}>
        Danh sách chủ điểm
      </h3>
      <ChannelItem topic={{ _id: '', text: 'General' }} classId={classId} />
      {loading ? (
        <Loading />
      ) : (
        Array.isArray(topics) &&
        topics.map((topic) => (
          <ChannelItem topic={topic} classId={classId} key={topic._id} />
        ))
      )}

      {user.role == ROLE_TEACHER ? (
        <TopicAdder classId={classId} addClassTopic={addClassTopic} />
      ) : (
        ''
      )}
    </div>
  );
};

const TopicAdder = ({ classId, addClassTopic }) => {
  const [text, setText] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    addClassTopic(text, classId);

    setText('');
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className={styles.topicAdder}>
      <div className={styles.topicAdder__top}>
        <form>
          <input
            className={styles.topicAdder__input}
            placeholder='Chủ điểm mới'
            onChange={(e) => onChange(e)}
            value={text}
            name='text'
          />
          <button onClick={submitHandler} type='submit'>
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
};

ChannelList.propTypes = {
  topic: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  addClassTopic: PropTypes.func.isRequired,
  getClassTopics: PropTypes.func.isRequired,
  resetClassTopics: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  topic: state.topic,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  addClassTopic,
  getClassTopics,
  resetClassTopics,
})(ChannelList);
