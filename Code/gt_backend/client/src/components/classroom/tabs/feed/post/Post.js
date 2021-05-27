import { Fragment, useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import { ExpandMoreOutlined } from '@material-ui/icons';
import { fetchPostImageUrl } from '../../../../../services/classroom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addComment } from '../../../../../sandbox/actions/post';
import './Post.css';

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
}) => {
  const [imageStream, setImageStream] = useState({ content: '' });
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState([...comments]);
  const [showCommentList, setShowCommentList] = useState(false);

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
      </div>

      {/* TODO test image display on frontend */}
      <div className='post__image'>
        {image ? <img src={imageStream.content} /> : ''}
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

Post.propTypes = {
  addComment: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { addComment })(Post);
