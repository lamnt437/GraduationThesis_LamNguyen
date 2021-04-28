import React from 'react';
import './Feed.css';
import MessageSender from './message_sender/MessageSender';
import Post from './post/Post';

export const Feed = ({ classId, name, description }) => {
  const message = 'Hello, world';
  const timestamp = '15-10-2020';
  const username = 'Lam Nguyen';
  const image =
    'https://baoquocte.vn/stores/news_dataimages/khanhchi/072019/06/17/chuan-bi-thanh-lap-hoi-nguoi-viet-nam-tai-fukuoka-nhat-ban.jpg';
  // 'https://baoquocte.vn/stores/news_dataimages/khanhchi/072019/06/17/chuan-bi-thanh-lap-hoi-nguoi-viet-nam-tai-fukuoka-nhat-ban.jpg';

  return (
    <div className='feed'>
      {/* StoryReel */}
      {/* MessageSender */}
      <figure className='feed__classroom'>
        <p>{name}</p>
        <figcaption>{description}</figcaption>
      </figure>

      <MessageSender classId={classId} />

      <Post
        // key={id}
        profilePic='https://avatars.githubusercontent.com/u/28838997?v=4'
        message={message}
        timestamp={timestamp}
        username={username}
        image={image}
      />
      <Post />
      <Post />
    </div>
  );
};
export default Feed;
