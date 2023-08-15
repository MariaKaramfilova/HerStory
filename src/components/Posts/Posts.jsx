import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import PostsDetails from './PostsDetails.jsx';
import PropTypes from "prop-types";
import { AuthContext } from '../../context/AuthContext.js';
import Skeleton from 'react-loading-skeleton';
import { PostsContext } from '../../context/PostsContext.js';
import _ from 'lodash';
import Error from '../../views/Error/Error.jsx';

export default function Posts({ searchTerm, userName, tag }) {
  const [filter, setFilter] = useState('new');
  const [loading, setLoading] = useState(true);
  const [renderedPosts, setRenderedPosts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const navigate = useNavigate();
  const params = useParams();
  const { loggedInUser, user } = useContext(AuthContext);
  const { allPosts } = useContext(PostsContext);

  
  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setSelectedButton(selectedFilter === 'new' ? 1 : selectedFilter === 'upvoted' ? 2 : 3);
  };
  
  useEffect(() => {
    setLoading(true);
    if (_.isEmpty(allPosts)) {
      return;
    }
    
    const sortPosts = (result) => {
      console.log(filter);
      
      let sortedPosts;
      if (filter === 'new') {
        sortedPosts = result.sort((a, b) => b.createdOn - a.createdOn);
      } else if (filter === 'upvoted') {
        sortedPosts = result.sort((a, b) => Object.keys(b).includes('upvotedBy') ? (Object.keys(b.upvotedBy).length - Object.keys(a.upvotedBy).length) : -1);
      } else if (filter === 'commented') {
        sortedPosts = result.sort((a, b) => Object.keys(b).includes('hasComment') ? (Object.keys(b.hasComment).length - Object.keys(a.hasComment).length) : -1);
      }
      return sortedPosts;
    }
    
    let result = [...allPosts];
    if (searchTerm) {
      result = result.filter(el => {
        return el.title.split(' ').filter(el => el.toLowerCase().startsWith(searchTerm.toLowerCase())).length > 0;
      });
    } else if (params.type === "tag") {
      result = result.filter(el => el.tags ? Object.keys(el.tags).filter(el => el.toLowerCase().startsWith(tag.toLowerCase())).length > 0 : false);
    } else if (params.type === "topics") {
      result = result.filter(el => el.topic.split(" ").join("") === params.id);
    }
    
    const sortedPosts = sortPosts(result);
    
    // Filter only 10 posts for logged out user
    let filteredPosts = user ? sortedPosts : sortedPosts.slice(0, sortedPosts.length <= 10 ? sortedPosts.length : 10);
    // Adjust view for showing posts in Account view
    setRenderedPosts(userName ? filteredPosts.filter(el => el.author === userName) : filteredPosts);
    
    setLoading(false);
  }, [filter, searchTerm, user, userName, tag, params.type, allPosts, params.id]);
  
  
  // Need to fix this with error pages - check for lib
  if (error) {
    return <Error error={error} />
  }
  
  const postsToShow = renderedPosts.length ? (
    renderedPosts.map(post => {
      const postDetailsProp = {
        goToDetails: () => navigate(`/posts/${post.uid}`),
        ...post
      };
      return <PostsDetails key={crypto.randomUUID()} {...postDetailsProp} />;
    })
    ) : (
      <div>
      <p>No posts to show</p>
    </div>
  )
  
  return (
    <>

      {searchTerm == undefined && (<Container className='mb-3 mt-5'>
        <Row className="d-flex justify-content-center align-items-center">
          <Col style={{ maxWidth: "fit-content" }}>
            <h5>Sort by:</h5>
          </Col>
          <Col>
            <ToggleButtonGroup type="radio" name="options" value={selectedButton} className='w-100'>
              <ToggleButton id="tbg-radio-1" value={1} onClick={() => handleFilterChange('new')} variant='outline-danger'>New Posts</ToggleButton>
              <ToggleButton id="tbg-radio-2" value={2} onClick={() => handleFilterChange('upvoted')} variant="outline-danger">Most Upvoted</ToggleButton>
              <ToggleButton id="tbg-radio-3" value={3} onClick={() => handleFilterChange('commented')} variant="outline-danger">Most Commented</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </Container>)}
      <Container>
        {_.isEmpty(allPosts) || !renderedPosts.length || loading ? <Skeleton height={500} count={5} style={{ marginBottom: "20px" }} /> : postsToShow}
      </Container>
    </>
  )
}

Posts.propTypes = {
  searchTerm: PropTypes.string,
  userName: PropTypes.string,
  tag: PropTypes.string,
  topic: PropTypes.string,
};
