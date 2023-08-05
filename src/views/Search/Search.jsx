import React from 'react'
import Posts from '../../components/Posts/Posts.jsx'
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export default function Search() {
  const params = useParams();
  const searchTerm = params.id;

  return (
    <>
      <Container className='mt-3'>
        <h3>Results for {searchTerm}:</h3>
        <Posts searchTerm={params.id} />
      </Container>
    </>
  )
}
