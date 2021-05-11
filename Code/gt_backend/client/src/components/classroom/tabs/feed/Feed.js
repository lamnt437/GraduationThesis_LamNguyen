import React from 'react';
import './Feed.css';
import MessageSender from './message_sender/MessageSender';
import Post from './post/Post';

export const Feed = ({ classId, name, description, posts }) => {
  // TODO change sorting by query params (React course 284)
  console.log(posts);

  return (
    <div className='feed'>
      {/* StoryReel */}
      {/* MessageSender */}
      <figure className='feed__classroom'>
        <p>{name}</p>
        <figcaption>{description}</figcaption>
      </figure>

      <MessageSender classId={classId} />

      {/* profilePic, image, username, timestamp, message */}
      {Array.isArray(posts) &&
        posts.map((post) => <Post message={post.text} key={post._id} />)}
    </div>
  );
};
export default Feed;
