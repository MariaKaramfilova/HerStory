import React, { useContext, useEffect, useState } from 'react'
import { PostsContext } from '../../context/PostsContext.js'
import { getAllPosts } from '../../services/post.services.js';

export default function PostsContextProvider({ children }) {
  const { post, setPost } = useContext(PostsContext);
  const [appPostState, setAppPostsState] = useState({ post, setPost });
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

  return (
    <div className='main-content'>
      <PostsContext.Provider value={{ ...appPostState, setAllPosts: setAppPostsState }}>
        {children}
      </PostsContext.Provider>
    </div>
  )
}
