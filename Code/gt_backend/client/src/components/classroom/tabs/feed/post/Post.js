import { Fragment, useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import { ExpandMoreOutlined } from '@material-ui/icons';
import { fetchPostImageUrl } from '../../../../../services/classroom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addComment } from '../../../../../sandbox/actions/post';
import './Post.css';
import commentStyles from './Comment.module.css';
// import topic from '../../../../../sandbox/reducers/topic';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const dateFormat = require('dateformat');

toast.configure();

const Post = ({
  postId,
  profilePic,
  image,
  username,
  timestamp,
  message,
  addComment,
  comments,
  user,
  currentTopic,
  topics,
}) => {
  const [imageStream, setImageStream] = useState({ content: '' });
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState([...comments]);
  const [showCommentList, setShowCommentList] = useState(false);
  const [currentTopicState, setCurrentTopicState] = useState(currentTopic);

  useEffect(async () => {
    const url = fetchPostImageUrl(image);
    setImageStream({ content: url });
  }, []);

  const onChangeComment = (e) => {
    setCommentText(e.target.value);
  };

  const onSubmitComment = (e) => {
    e.preventDefault();
    // use redux
    addComment(postId, commentText);
    if (commentText.length > 0) {
      setCommentList([
        ...commentList,
        {
          username: user.name,
          text: commentText,
          created_at: Date.now(),
        },
      ]);
    }
    setCommentText('');
  };

  const toggleShowCommentList = (e) => {
    e.preventDefault();
    setShowCommentList(!showCommentList);
  };

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

  const created_at = new Date(timestamp);

  return (
    <div className='classpost'>
      <div className='post__top'>
        <Avatar src={profilePic} className='post__avatar' />
        <div className='post__topInfo'>
          <h3>{username}</h3>
          <p>{dateFormat(created_at, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}</p>
        </div>
      </div>

      <div className='post__bottom'>
        <p>{message}</p>
      </div>

      <div className='post__image'>
        {image ? <img src={imageStream.content} /> : ''}
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
              <button type='submit'>Đăng</button>
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
        comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
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

const TopicPicker = ({ currentTopic, topics }) => {
  const [click, setClick] = useState(false);

  const handleClick = (e) => {
    console.log('clicked');
    setClick(!click);
  };

  const onChangeSelection = (e) => {
    // send axios request to change topic
    console.log(e.target.value);
  };

  return (
    // <ul className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}>
    //   {currentTopic ? (
    //     <li onClick={handleClick}>{currentTopic.text}</li>
    //   ) : (
    //     <li>general</li>
    //   )}
    //   {Array.isArray(topics) &&
    //     topics.map((topic) => {
    //       console.log({ topic });
    //       return <li key={topic._id}>{topic.text}</li>;
    //     })}
    // </ul>
    <select onChange={onChangeSelection}>
      <option value='hello' selected>
        Hello
      </option>
      <option value='world'>World</option>
    </select>
    // display general option also?
    // what if general being clicked?
  );
};

Post.propTypes = {
  addComment: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  topics: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  topics: state.topic.topics,
});

export default connect(mapStateToProps, { addComment })(Post);
