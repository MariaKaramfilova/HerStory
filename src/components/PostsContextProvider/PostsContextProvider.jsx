// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import { PostsContext } from '../../context/PostsContext.js'
import { getAllPosts } from '../../services/post.services.js';
import Error from '../../views/Error/Error.jsx';
import PropTypes from "prop-types";

/**
 * A context provider component for managing posts data within the application.
 *
 * Fetches all posts data and provides it through a context for other components to access.
 *
 * @component
 * @param {object} children - The nested components that will be wrapped by this context provider.
 * @returns {JSX.Element} Rendered component with posts context provider.
 */
export default function PostsContextProvider({ children }) {
  const { post, setPost } = useContext(PostsContext);
  const [appPostState, setAppPostsState] = useState({ post, setPost });
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let result = await getAllPosts();
        setAppPostsState((prev) => ({ ...prev, allPosts: result }));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  if (error) {
    return <Error error={error} />
  }

  return (
    <div className='main-content'>
      <PostsContext.Provider value={{ ...appPostState, setAllPosts: setAppPostsState }}>
        {children}
      </PostsContext.Provider>
    </div>
  )
}

PostsContextProvider.propTypes = {
  children: PropTypes.node,
};
