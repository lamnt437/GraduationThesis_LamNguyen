import React, { useState } from 'react';
import './MessageSender.css';
import { Avatar } from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import axios from 'axios';

const MessageSender = (props) => {
  const [postContent, setPostContent] = useState({
    text: '',
  });

  const submitHandler = async (e) => {
    // TODO redirect after submit post (React course 282 programmatic)
    // TODO prevent unwanted transition to other page
    // TODO add loading spinner
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // TODO validate input
    const url = `http://localhost:3001/api/classroom/${props.classId}/posts`;
    const body = JSON.stringify(postContent);

    try {
      console.log(body);
      const res = await axios.put(url, body, config);
      console.log(res);
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

export default MessageSender;
