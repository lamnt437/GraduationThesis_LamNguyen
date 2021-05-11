import { useEffect, useState } from 'react';
import './Feed.css';
import Post from './post/Post';
import { fetchPosts, addPost } from '../../../../services/classroom';

import './message_sender/MessageSender.css';
import { Avatar } from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

      {isLoading
        ? '<div>Loading ....</div>'
        : Array.isArray(posts) &&
          posts.map((post) => (
            <Post
              username={post.username}
              timestamp={post.created_at}
              message={post.text}
              key={post._id}
              avatar={post.avatar}
            />
          ))}
    </div>
  );
};

const MessageSender = ({ posts, setPosts, classId, user }) => {
  const [postContent, setPostContent] = useState({
    text: '',
  });

  const submitHandler = async (e) => {
    // TODO prevent unwanted transition to other page
    e.preventDefault();

    try {
      const response = await addPost(postContent.text, classId);

      let newPost = response.data.post;
      newPost.username = user.name;
      newPost.avatar = user.avatar;

      setPosts([...posts, newPost]);
      setPostContent({ ...postContent, text: '' });
    } catch (err) {
      console.error(err.message);
    }
  };

  // 2 way binding
  const onChange = (e) => {
    setPostContent({ ...postContent, [e.target.name]: e.target.value });
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
          <button onClick={submitHandler} type='submit'>
            Post
          </button>
        </form>
      </div>

      <div className='messageSender__bottom'>
        <div className='messageSender__option'>
          <PhotoLibraryIcon style={{ color: 'green' }} />
          <h3>Photo/Video</h3>
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
