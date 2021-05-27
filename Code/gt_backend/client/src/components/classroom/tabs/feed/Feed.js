import { useEffect, useState } from 'react';
import './Feed.css';
import Post from './post/Post';
import PostMeeting from './post/PostMeeting';

import './message_sender/MessageSender.css';
import { Avatar } from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from '../../../layout/Loading';
import {
  getPosts,
  resetPosts,
  addPost,
} from '../../../../sandbox/actions/post';

import {
  CLASS_POST_TYPE_NORMAL,
  CLASS_POST_TYPE_MEETING,
} from '../../../../constants/constants';

export const Feed = ({
  classId,
  user,
  getPosts,
  addPost,
  classroomName,
  post: { posts, loading },
}) => {
  useEffect(() => {
    console.log('render feed');
    getPosts(classId);

    return () => {
      console.log('Unmount Feed');
      resetPosts();
    };
  }, []);

  return (
    <div className='feed'>
      <MessageSender
        classId={classId}
        posts={posts}
        user={user}
        addPost={addPost}
      />

      {loading ? (
        <Loading />
      ) : (
        Array.isArray(posts) &&
        posts.map((post) => {
          if (post.type == CLASS_POST_TYPE_MEETING) {
            return (
              <PostMeeting
                postId={post._id}
                username={post.username}
                timestamp={post.created_at}
                message={post.text}
                key={post._id}
                avatar={post.avatar}
                image={post.image}
                meeting={post.meeting}
                user={user}
                comments={post.comments}
              />
            );
          } else if (post.type == CLASS_POST_TYPE_NORMAL) {
            return (
              <Post
                postId={post._id}
                username={post.username}
                timestamp={post.created_at}
                message={post.text}
                key={post._id}
                avatar={post.avatar}
                image={post.image}
                comments={post.comments}
              />
            );
          }
        })
      )}
    </div>
  );
};

const MessageSender = ({ posts, classId, user, addPost }) => {
  const [postContent, setPostContent] = useState({
    text: '',
    image: null,
  });

  let inputFileProp = null;

  const submitHandler = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('text', postContent.text);
    fd.append('image', postContent.image);
    fd.append('type', CLASS_POST_TYPE_NORMAL);

    addPost(fd, classId);

    setPostContent({ text: '', image: null });
  };

  const onChange = (e) => {
    setPostContent({ ...postContent, [e.target.name]: e.target.value });
  };

  const fileSelectedHandler = (e) => {
    setPostContent({ ...postContent, image: e.target.files[0] });
  };

  return (
    <div className='messageSender'>
      <div className='messageSender__top'>
        <Avatar />
        <form>
          <input
            className='messageSender__input'
            placeholder='What is on your mind?'
            onChange={(e) => onChange(e)}
            value={postContent.text}
            name='text'
          />
          <input
            style={{ display: 'none' }}
            type='file'
            ref={(fileInput) => (inputFileProp = fileInput)}
            onChange={(e) => fileSelectedHandler(e)}
          />
          <button onClick={submitHandler} type='submit'>
            Post
          </button>
        </form>
      </div>
      <div>{postContent.image ? postContent.image.name : ''}</div>
      <div className='messageSender__bottom'>
        <div
          className='messageSender__option'
          onClick={() => inputFileProp.click()}
          style={{ cursor: 'pointer' }}
        >
          <PhotoLibraryIcon style={{ color: 'green' }} />
          <h3>Ảnh</h3>
        </div>

        <div className='messageSender__option'>
          <InsertEmoticonIcon style={{ color: 'orange' }} />
          <h3>Feeling/Activity</h3>
        </div>
      </div>
    </div>
  );
};

Feed.propTypes = {
  user: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  resetPosts: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  post: state.post,
});

export default connect(mapStateToProps, { getPosts, resetPosts, addPost })(
  Feed
);
