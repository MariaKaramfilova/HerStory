import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import { getAllComments, getAllPosts } from '../../services/post.services.js';
import { useNavigate, useParams } from 'react-router-dom';
import PostsDetails from './PostsDetails.jsx';
import PropTypes from "prop-types";
import { AuthContext } from '../../context/AuthContext.js';
import Skeleton from 'react-loading-skeleton';

export default function Posts({ searchTerm, userName, tag }) {
  const [filter, setFilter] = useState('new');
  const [renderedPosts, setRenderedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const navigate = useNavigate();
  const params = useParams();
  const { loggedInUser, user } = useContext(AuthContext);



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let result = await getAllPosts();
        if (searchTerm) {
          result = result.filter(el => {
            return el.title.split(' ').filter(el => el.toLowerCase().startsWith(searchTerm.toLowerCase())).length > 0;
          });
        } else if (params.type === "tag") {
          console.log('posts');
          console.log(result);
          result = result.filter(el => el.tags ? Object.keys(el.tags).filter(el => el.toLowerCase().startsWith(tag.toLowerCase())).length > 0 : false);
        }

        if (filter === 'new') {
          result = result.sort((a, b) => b.createdOn - a.createdOn);
        } else if (filter === 'upvoted') {
          result = result.sort((a, b) => Object.keys(b.upvotedBy).length - Object.keys(a.upvotedBy).length);
        } else {
          result = result.sort((a, b) => Object.keys(b.hasComment).length - Object.keys(a.hasComment).length);
        }

        let data = user ? result : result.slice(0, result.length <= 10 ? result.length : 10);
        setRenderedPosts(userName ? data.filter(el => el.author === userName) : data);
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts();
  }, [filter, searchTerm, user, userName, tag, params.type]);


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
      return <PostsDetails key={crypto.randomUUID()} {...postDetailsProp} />;
    })
  ) : (
    <div>
      <p>No posts to show</p>
    </div>
  )

  return (
    <>
            <div style={{ maxWidth: "80%" }}>
                <h3>Welcome to HerStory</h3>
                <p>Women`s Human Rights Forum: A place to connect, learn and act for gender equality. Join us today and be part of the change. 💜</p>
            </div>

      {searchTerm == undefined && (<Container className='mb-3 mt-5'>
        <Row className="d-flex justify-content-center align-items-center">
          <Col style={{ maxWidth: "fit-content" }}>
            <h5>Sort by:</h5>
          </Col>
          <Col>
            <ToggleButtonGroup type="radio" name="options" value={selectedButton} className='w-100'>
              <ToggleButton id="tbg-radio-1" value={1} onClick={() => { setFilter('new'); setSelectedButton(1) }} variant='outline-danger'>New Posts</ToggleButton>
              <ToggleButton id="tbg-radio-2" value={2} onClick={() => { setFilter('upvoted'); setSelectedButton(2) }} variant="outline-danger">Most Upvoted</ToggleButton>
              <ToggleButton id="tbg-radio-3" value={3} onClick={() => { setFilter('commented'); setSelectedButton(3) }} variant="outline-danger">Most Commented</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </Container>)}
      <Container>
        {loading && !renderedPosts.length ? <Skeleton height={300} count={5} style={{ marginBottom: "20px" }} /> : postsToShow}
      </Container>
    </>
  )
}

Posts.propTypes = {
  searchTerm: PropTypes.string,
  userName: PropTypes.string,
  tag: PropTypes.string,
};
