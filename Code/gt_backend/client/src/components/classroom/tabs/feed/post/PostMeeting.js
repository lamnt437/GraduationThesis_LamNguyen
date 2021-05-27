import { useState, Fragment } from 'react';
import './Post.css';
import { Avatar } from '@material-ui/core';
import { ExpandMoreOutlined } from '@material-ui/icons';
import MeetingItem from '../../meeting/MeetingItem';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addComment } from '../../../../../sandbox/actions/post';

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
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState([...comments]);
  const [showCommentList, setShowCommentList] = useState(false);

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
  console.log({ comment });
  return (
    <div>
      <p>{comment.username}</p>
      <p>{comment.text}</p>
      <p>{Date(comment.created_at).toString()}</p>
    </div>
  );
};

PostMeeting.propTypes = {
  addComment: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { addComment })(PostMeeting);
