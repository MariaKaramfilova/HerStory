import { faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { getPostsByAuthor } from '../../services/post.services.js';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import Error from '../Error/Error.jsx';

export default function PostTags({ post }) {
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPostsByAuthor(post.author)
      .then(data => {
        console.log();
        const filterValidTags = Object.entries(data.filter(el => el.postId === post.postId)[0].tags);
        const defaultTagsList = filterValidTags.map(el => el[0]);
        setTags(defaultTagsList);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))

  }, [post]);

  const tagsToshow = tags.length ? tags.map((tag, index) => {
    return (<p key={crypto.randomUUID()}><Link to={`/search/tag/${tag}`}>{tag}</Link>{index !== tags.length - 1 && ','}&nbsp;</p>)
  }) : (
    <div>
      <p>No tags</p>
    </div>
  )

  return (
    <Container className='d-flex mt-4'>
      <div>
        <FontAwesomeIcon icon={faTags} style={{ "--fa-primary-color": "#f5195a", "--fa-secondary-color": "#f5195a", }} />&nbsp;
      </div>
      {!loading && tagsToshow}
    </Container>
  )
}

PostTags.propTypes = {
  post: PropTypes.object.isRequired,
};
