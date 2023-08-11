import React from 'react'
import Posts from '../../components/Posts/Posts.jsx'
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Users from '../../components/Users/Users.jsx';

export default function Search() {
  const params = useParams();
  const searchTerm = params.id;

  return (
    <>
      <Container className='mt-3'>
        <h3>Results for {searchTerm}:</h3>
        {params.type === 'posts' && <Posts searchTerm={params.id}/>}
        {params.type === 'tag' && <Posts tag={params.id} />}
        {params.type.includes('users') && <Users searchTerm={params.id}/>}
      </Container>
    </>
  )
}
