import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import { getAllPosts } from '../../services/post.services.js';
import { useNavigate } from 'react-router-dom';
import PostsDetails from './PostsDetails.jsx';
import PropTypes from "prop-types";
import { AuthContext } from '../../context/AuthContext.js';
import Skeleton from 'react-loading-skeleton';

export default function Posts({ searchTerm }) {
  const [filter, setFilter] = useState('new');
  const [renderedPosts, setRenderedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    let result;

    const slicePosts = (user, result) => user ? result : result.slice(0, result.length <= 10 ? result.length : 10)

    getAllPosts()
      .then(snapshot => {
        if (searchTerm) {
          result = snapshot.filter(el => {
            return el.title.split(' ').filter(el => el.toLowerCase().startsWith(searchTerm.toLowerCase())).length > 0;
          })
          setRenderedPosts(slicePosts(user, result));
        } else if (filter === 'new') {
          result = snapshot.sort((a, b) => b.createdOn - a.createdOn)
          setRenderedPosts(slicePosts(user, result));
        } else {
          result = snapshot.sort((a, b) => Object.keys(b.likedBy).length - Object.keys(a.likedBy).length);
          setRenderedPosts(slicePosts(user, result));
        }
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [filter, searchTerm, user]);

  // Need to fix this with error pages - check for lib
  if (error) {
    return <h1>Error!!! {error.message}</h1>
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
      {searchTerm == undefined && (<Container className='mb-3 mt-5'>
        <Row style={{ maxWidth: "fit-content" }}>
          <Col style={{ maxWidth: "fit-content" }}>
            <h5>Filter by:</h5>
          </Col>
          <Col>
            <ToggleButtonGroup type="radio" name="options" value={selectedButton} className='w-100'>
              <ToggleButton id="tbg-radio-1" value={1} onClick={() => { setFilter('new'); setSelectedButton(1) }} variant="danger">New posts</ToggleButton>
              <ToggleButton id="tbg-radio-2" value={2} onClick={() => { setFilter('upvoted'); setSelectedButton(2) }} variant="danger">Upvoted posts</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </Container>)}
      <Container>
        {loading ? <Skeleton height={300} count={5} style={{ marginBottom: "20px" }} /> : postsToShow}
      </Container>
    </>
  )
}

Posts.propTypes = {
  searchTerm: PropTypes.string,
};
