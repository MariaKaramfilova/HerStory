import React, { useEffect, useState } from 'react'
import { Col, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import Loading from '../Loading/Loading.jsx';
import { getAllPosts } from '../../services/post.services.js';
import { useNavigate } from 'react-router-dom';
import PostsDetails from './PostsDetails.jsx';
import PropTypes from "prop-types";

export default function Posts({ searchTerm }) {
  const [filter, setFilter] = useState('new');
  const [renderedPosts, setRenderedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    getAllPosts()
      .then(snapshot => {
        if (searchTerm) {
          setRenderedPosts(snapshot.filter(el => {
            return el.title.split(' ').filter(el => el.toLowerCase().startsWith(searchTerm.toLowerCase())).length > 0;
          }));
        } else if (filter === 'new') {
          setRenderedPosts(snapshot.sort((a, b) => b.createdOn - a.createdOn));
        } else {
          setRenderedPosts(snapshot.sort((a, b) => Object.keys(b.likedBy).length - Object.keys(a.likedBy).length));
        }
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [filter, searchTerm]);

  if (loading) {
    return <Loading />
  }

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
              <ToggleButton id="tbg-radio-1" value={1} onClick={() => {setFilter('new'); setSelectedButton(1)}} variant="danger">New posts</ToggleButton>
              <ToggleButton id="tbg-radio-2" value={2} onClick={() => {setFilter('upvoted'); setSelectedButton(2)}} variant="danger">Upvoted posts</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </Container>)}
      <Container>
        {postsToShow}
      </Container>
    </>
  )
}

Posts.propTypes = {
  searchTerm: PropTypes.string,
};
