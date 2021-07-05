import { useEffect, useState } from 'react';
import './Feed.css';
import Post from './post/Post';
import PostMeeting from './post/PostMeeting';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from '../../../layout/Loading';
import { getFilteredPosts, resetPosts } from '../../../../sandbox/actions/post';
import { fetchTopicDetail } from '../../../../services/classroom';
import {
  CLASS_POST_TYPE_NORMAL,
  CLASS_POST_TYPE_MEETING,
} from '../../../../constants/constants';
import { useLocation } from 'react-router-dom';
import styles from './FilterFeed.module.css';

const FilterFeed = ({
  classId,
  user,
  getFilteredPosts,
  post: { posts, loading },
}) => {
  const search = useLocation().search;
  const topic = new URLSearchParams(search).get('topic');
  const [topicObj, setTopicObj] = useState({
    topic: null,
    loading: true,
  });

  useEffect(() => {
    getFilteredPosts(classId, topic);

    return () => {
      resetPosts();
    };
  }, [topic]);

  useEffect(async () => {
    try {
      const response = await fetchTopicDetail(topic);
      console.log({ response });
      setTopicObj({ topic: response.data.topic, loading: false });
    } catch (err) {
      console.error(err.message);
    }
  }, [topic]);

  const [pageInfo, setPageInfo] = useState({
    numberOfPages: 1,
    currentPage: 1,
    limit: 10,
  });

  const { currentPage, limit } = pageInfo;

  useEffect(() => {
    let numberOfPosts = 0;
    if (Array.isArray(posts)) {
      numberOfPosts = posts.length;
    }

    let numberOfPages = Math.floor(numberOfPosts / pageInfo.limit) + 1;
    setPageInfo({ ...pageInfo, numberOfPages });
  }, [posts]);

  const prevPageHandler = (e) => {
    e.preventDefault();
    // limit, so that currentPage >= 1
    if (currentPage > 1) {
      setPageInfo({ ...pageInfo, currentPage: currentPage - 1 });
      window.scrollTo(0, 0);
    }
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    // limit, so that currentPage <= numberOfPages
    if (currentPage < pageInfo.numberOfPages) {
      setPageInfo({ ...pageInfo, currentPage: currentPage + 1 });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className='feed'>
      {topicObj.loading ? (
        <div className={styles.filter_indicator}>
          <h3>Chủ điểm: Chung</h3>
        </div>
      ) : (
        <div className={styles.filter_indicator}>
          <h3>Chủ điểm: {topicObj.topic.text}</h3>
        </div>
      )}
      <div style={{ display: 'flex', 'margin-top': '15px' }}>
        <button onClick={(e) => prevPageHandler(e)}>Prev</button>\
        <button onClick={(e) => nextPageHandler(e)}>Next</button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        Array.isArray(posts) &&
        posts.map((post, index) => {
          if (
            index >= (currentPage - 1) * limit &&
            index <= currentPage * limit - 1
          ) {
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
                  currentTopic={post.topic}
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
                  currentTopic={post.topic}
                />
              );
            }
          }
        })
      )}

      <div style={{ display: 'flex', 'margin-top': '15px' }}>
        <button onClick={(e) => prevPageHandler(e)}>Prev</button>\
        <button onClick={(e) => nextPageHandler(e)}>Next</button>
      </div>
    </div>
  );
};

FilterFeed.propTypes = {
  user: PropTypes.object.isRequired,
  getFilteredPosts: PropTypes.func.isRequired,
  resetPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  post: state.post,
});

export default connect(mapStateToProps, { getFilteredPosts, resetPosts })(
  FilterFeed
);
