import React from 'react'
import Posts from '../../components/Posts/Posts.jsx'
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Users from '../../components/Users/Users.jsx';
import { POSTS, TAG, USERS } from '../../common/common.js';

/**
 * The Search component displays search results based on the provided route parameters.
 *
 * @component
 * @returns {JSX.Element} - JSX representing the Search component.
 */
export default function Search() {
  const params = useParams();
  const searchTerm = params.id;

  return (
    <>
      <Container className='mt-3'>
        <h3>Results for {searchTerm}:</h3>
        {params.type === POSTS && <Posts searchTerm={params.id}/>}
        {params.type === TAG && <Posts tag={params.id} />}
        {params.type.includes(USERS) && <Users searchTerm={params.id}/>}
      </Container>
    </>
  )
}
