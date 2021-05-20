import { useEffect, useState } from 'react';
import './Post.css';
import { Avatar } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NearMeIcon from '@material-ui/icons/NearMe';
import { ExpandMoreOutlined } from '@material-ui/icons';
import { fetchPostImageUrl } from '../../../../../services/classroom';
import MeetingItem from '../../meeting/MeetingItem';

const PostMeeting = ({
  profilePic,
  image,
  username,
  timestamp,
  message,
  meeting,
  user,
}) => {
  const [imageStream, setImageStream] = useState({ content: '' });

  useEffect(async () => {
    const url = fetchPostImageUrl(image);
    setImageStream({ content: url });
    console.log({ meeting });
  }, []);

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

      {/* TODO test image display on frontend */}
      <div className='post__image'>
        {image ? <img src={imageStream.content} /> : ''}
      </div>

      <div className='post__options'>
        <div className='post__option'>
          <ThumbUpIcon />
          <p>Like</p>
        </div>

        <div className='post__option'>
          <ChatBubbleOutlineIcon />
          <p>Comment</p>
        </div>

        <div className='post__option'>
          <NearMeIcon />
          <p>Share</p>
        </div>

        <div className='post__option'>
          <AccountCircleIcon />
          <ExpandMoreOutlined />
        </div>
      </div>
    </div>
  );
};

export default PostMeeting;