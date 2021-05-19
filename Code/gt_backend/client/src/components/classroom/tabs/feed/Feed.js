import { useEffect, useState } from 'react';
import './Feed.css';
import Post from './post/Post';
import PostMeeting from './post/PostMeeting';
import { fetchPosts, addPost } from '../../../../services/classroom';

import './message_sender/MessageSender.css';
import { Avatar } from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from '../../../layout/Loading';
import {
  CLASS_POST_TYPE_NORMAL,
  CLASS_POST_TYPE_MEETING,
} from '../../../../constants/constants';

export const Feed = ({ classId, user }) => {
  // TODO change sorting by query params (React course 284)
  // fetch post
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    // fetch posts
    try {
      const res = await fetchPosts(classId);
      console.log(res);
      setPosts(res.data.posts);
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      console.log(error.response);
      setIsLoading(false);
    }
  }, []);

  return (
    <div className='feed'>
      <MessageSender
        classId={classId}
        posts={posts}
        setPosts={setPosts}
        user={user}
      />

      {isLoading ? (
        <Loading />
      ) : (
        Array.isArray(posts) &&
        posts.map((post) => {
          if (post.type == CLASS_POST_TYPE_MEETING) {
            return (
              <PostMeeting
                username={post.username}
                timestamp={post.created_at}
                message={post.text}
                key={post._id}
                avatar={post.avatar}
                image={post.image}
                meeting={post.meeting}
                user={user}
              />
            );
          } else if (post.type == CLASS_POST_TYPE_NORMAL) {
            return (
              <Post
                username={post.username}
                timestamp={post.created_at}
                message={post.text}
                key={post._id}
                avatar={post.avatar}
                image={post.image}
              />
            );
          }
        })
      )}
    </div>
  );
};

const MessageSender = ({ posts, setPosts, classId, user }) => {
  const [postContent, setPostContent] = useState({
    text: '',
    image: null,
  });

  let inputFileProp = null;

  const submitHandler = async (e) => {
    // TODO prevent unwanted transition to other page
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append('text', postContent.text);
      fd.append('image', postContent.image);
      fd.append('type', CLASS_POST_TYPE_NORMAL);

      const response = await addPost(fd, classId);

      let newPost = response.data.post;
      newPost.username = user.name;
      newPost.avatar = user.avatar;

      setPosts([newPost, ...posts]);
      setPostContent({ text: '', image: null });
    } catch (err) {
      console.error(err.message);
    }
  };

  // 2 way binding
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
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Feed);
