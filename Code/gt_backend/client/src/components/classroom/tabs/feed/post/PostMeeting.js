import { useState, Fragment } from 'react';
import './Post.css';
import { Avatar } from '@material-ui/core';
import { ExpandMoreOutlined } from '@material-ui/icons';
import MeetingItem from '../../meeting/MeetingItem';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addComment } from '../../../../../sandbox/actions/post';
import commentStyles from './Comment.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

toast.configure();

const dateFormat = require('dateformat');

const PostMeeting = ({
  postId,
  profilePic,
  username,
  timestamp,
  message,
  meeting,
  comments,
  user,
  addComment,
  currentTopic,
  topics,
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState([...comments]);
  const [showCommentList, setShowCommentList] = useState(false);
  const [currentTopicState, setCurrentTopicState] = useState(currentTopic);

  const onChangeComment = (e) => {
    setCommentText(e.target.value);
  };

  const onSubmitComment = (e) => {
    e.preventDefault();

    addComment(postId, commentText);
    setCommentList([
      ...commentList,
      {
        username: user.name,
        text: commentText,
        created_at: Date.now(),
      },
    ]);
    setCommentText('');
  };

  const toggleShowCommentList = (e) => {
    e.preventDefault();
    setShowCommentList(!showCommentList);
  };
  const created_at = new Date(timestamp);

  const changeTopicHandler = async (e) => {
    console.log(e.target.value);
    const topicId = e.target.value;
    topics.forEach((topic) => {
      if (topic._id.toString() === topicId) {
        setCurrentTopicState(topic);
      }
    });

    // send axios request
    const body = JSON.stringify({
      topicId,
    });
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.put(`/api/posts/${postId}`, body, options);
      toast.success('Đổi chủ điểm thành công!', { autoClose: 3000 });
    } catch (err) {
      toast.error('Đổi chủ điểm thất bại!', { autoClose: 3000 });
    }
  };

  return (
    <div className='classpost'>
      <div className='post__top'>
        <Avatar src={profilePic} className='post__avatar' />
        <div className='post__topInfo'>
          <h3>{username}</h3>
          <p>{created_at.toString()}</p>
        </div>
      </div>

      <div className='post__bottom'>
        <p>{message}</p>
        <MeetingItem meeting={meeting} user={user} />
      </div>

      <div
        style={{
          'margin-top': '10px',
          'padding-left': '25px',
          'padding-bottom': '25px',
        }}
      >
        {/* <TopicPicker currentTopic={currentTopic} topics={topics} /> */}
        <form className='topic__select'>
          <label>Chủ điểm </label>
          <select onChange={(e) => changeTopicHandler(e)}>
            {currentTopicState ? (
              ''
            ) : (
              <option value='' select>
                Chung
              </option>
            )}
            {Array.isArray(topics) &&
              topics.map((topic) => (
                <option
                  value={topic._id}
                  selected={
                    currentTopicState?._id?.toString() == topic._id.toString()
                  }
                >
                  {topic.text}
                </option>
              ))}
          </select>
        </form>
      </div>

      <div className='post__options'>
        {/* comment input */}
        <div className='post__comment'>
          <div>
            <p>
              {Array.isArray(commentList) ? commentList.length : 0} bình luận
            </p>
            <button onClick={(e) => toggleShowCommentList(e)}>
              {showCommentList ? 'Ẩn bình luận' : 'Hiện bình luận'}
            </button>
          </div>

          {showCommentList ? (
            <div>
              <CommentList comments={commentList} />
            </div>
          ) : null}

          <div className='post__comment__top'>
            <form onSubmit={(e) => onSubmitComment(e)}>
              <input
                className='post__comment__input'
                onChange={(e) => onChangeComment(e)}
                value={commentText}
                placeholder='Bình luận'
                name='text'
              />
              <button type='submit'>Post</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentList = ({ comments }) => {
  return (
    <Fragment>
      {Array.isArray(comments) &&
        comments.map((comment) => <CommentItem comment={comment} />)}
    </Fragment>
  );
};

const CommentItem = ({ comment }) => {
  return (
    <div className={commentStyles.comment}>
      <div className={commentStyles.comment__top}>
        <h5>{comment.username}</h5>
        <p>
          {dateFormat(comment.created_at, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}
        </p>
      </div>
      <div className={commentStyles.comment__bottom}>
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

PostMeeting.propTypes = {
  addComment: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  topics: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  topics: state.topic.topics,
});

export default connect(mapStateToProps, { addComment })(PostMeeting);
