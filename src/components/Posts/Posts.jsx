import React, { useEffect, useState } from 'react'
import { Col, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import Loading from '../Loading/Loading.jsx';
import { getAllPosts } from '../../services/post.services.js';
import { useNavigate } from 'react-router-dom';
import PostsDetails from './PostsDetails.jsx';

export default function Posts() {
  const [filter, setFilter] = useState('');
  const [renderedPosts, setRenderedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    getAllPosts()
      .then(snapshot => {
        if (filter === 'new') {
          snapshot.sort((a, b) => a.createdOn - b.createdOn);
        } else {
          snapshot.sort((a, b) => Object.keys(b.likedBy).length - Object.keys(a.likedBy).length);
        }
        setRenderedPosts(snapshot);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [filter]);

  if (loading) {
    return <Loading />
  }

  // Need to fix this with error pages - check for lib
  if (error) {
    return <h1>Error!!!</h1>
  }

  const postsToShow = renderedPosts.length ? (
    renderedPosts.map(post => {
      const postDetailsProp = {
        goToDetails: () => navigate(`/posts/${post.uid}`),
        ...post
      };
      return <PostsDetails key={post.uid} {...postDetailsProp} />;
    })
  ) : (
    <div>
      <p>No posts to show</p>
    </div>
  )

  return (
    <>
      <Container className='mb-3 mt-5'>
        <Row style={{ maxWidth: "fit-content" }}>
          <Col style={{ maxWidth: "fit-content" }}>
            <h5>Filter by:</h5>
          </Col>
          <Col>
            <ToggleButtonGroup type="radio" name="options" defaultValue={1} className='w-100'>
              <ToggleButton id="tbg-radio-1" value={1} onClick={() => setFilter('new')} variant="danger">New posts</ToggleButton>
              <ToggleButton id="tbg-radio-2" value={2} onClick={() => setFilter('upvoted')} variant="danger">Upvoted posts</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </Container>
      <Container>
        {postsToShow}
      </Container>
    </>
  )
}
