import { useEffect, useState } from 'react';
import './Feed.css';
import MessageSender from './message_sender/MessageSender';
import Post from './post/Post';
import { fetchPosts } from '../../../../services/classroom';

export const Feed = ({ classId }) => {
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
      <MessageSender classId={classId} />

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
export default Feed;
