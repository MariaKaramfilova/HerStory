// eslint-disable-next-line no-unused-vars
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
import { COMMENTED, HAS_cOMMENT, NEW, NEW_POSTS, TAG, TOPICS, UPVOTED, UPVOTED_BY } from '../../common/common.js';
import { MOST_UPVOTED } from '../../common/common.js';
import { MOST_COMMENTED } from '../../common/common.js';
import { SORT_BY } from '../../common/common.js';

/**
 * A component to display posts based on various filters.
 *
 * Displays a list of posts with filtering options based on search term, user name, and tag.
 *
 * @component
 * @param {string} searchTerm - The search term for filtering posts.
 * @param {string} userName - The user name for filtering posts by a specific user.
 * @param {string} tag - The tag for filtering posts by a specific tag.
 * @returns {JSX.Element} Rendered component with posts list.
 * @example
 * return (
 *   <Posts searchTerm="equality" />
 * );
 */
export default function Posts({ searchTerm, userName, tag }) {
  const [filter, setFilter] = useState(NEW);
  const [loading, setLoading] = useState(false);
  const [renderedPosts, setRenderedPosts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const navigate = useNavigate();
  const params = useParams();
  // eslint-disable-next-line no-unused-vars
  const { loggedInUser, user } = useContext(AuthContext);
  const { allPosts } = useContext(PostsContext);


  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setSelectedButton(selectedFilter === NEW ? 1 : selectedFilter === UPVOTED ? 2 : 3);
  };

  useEffect(() => {
    if (_.isEmpty(allPosts)) {
      return;
    }
    const sortPosts = (result) => {

      let sortedPosts;
      if (filter === NEW) {
        sortedPosts = result.sort((a, b) => b.createdOn - a.createdOn);
      } else if (filter === UPVOTED) {
        sortedPosts = result.sort((a, b) => Object.keys(b).includes(UPVOTED_BY) ? (Object.keys(b.upvotedBy).length - Object.keys(a.upvotedBy).length) : -1);
      } else if (filter === COMMENTED) {
        sortedPosts = result.sort((a, b) => Object.keys(b).includes(HAS_cOMMENT) ? (Object.keys(b.hasComment).length - Object.keys(a.hasComment).length) : -1);
      }
      return sortedPosts;
    }
    setLoading(true);

    let result = [...allPosts];
    if (searchTerm) {
      result = result.filter(el => {
        return el.title.split(' ').filter(el => el.toLowerCase().startsWith(searchTerm.toLowerCase())).length > 0;
      });
    } else if (params.type === TAG) {
      result = result.filter(el => el.tags ? Object.keys(el.tags).filter(el => el.toLowerCase().startsWith(tag.toLowerCase())).length > 0 : false);
    } else if (params.type === TOPICS) {
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
            <h5>{SORT_BY}</h5>
          </Col>
          <Col>
            <ToggleButtonGroup type="radio" name="options" value={selectedButton} className='w-100'>
              <ToggleButton id="tbg-radio-1" value={1} onClick={() => handleFilterChange(NEW)} variant='outline-danger'>{NEW_POSTS}</ToggleButton>
              <ToggleButton id="tbg-radio-2" value={2} onClick={() => handleFilterChange(UPVOTED)} variant="outline-danger">{MOST_UPVOTED}</ToggleButton>
              <ToggleButton id="tbg-radio-3" value={3} onClick={() => handleFilterChange(COMMENTED)} variant="outline-danger">{MOST_COMMENTED}</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </Container>)}
      <Container>
        {_.isEmpty(allPosts) || loading ? <Skeleton height={400} count={5} style={{ marginBottom: "20px" }} /> : postsToShow}
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
