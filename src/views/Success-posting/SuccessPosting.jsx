import React from 'react'
import { Alert, Card, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function SuccessPosting() {
  return (
    <Container className='align-items-center justify-content-center w-100' style={{ minHeight: "100vh", maxWidth: "60%" }}>
        <Card className='align-items-center justify-content-center mx-auto my-auto' style={{ maxWidth: "60%" }}>
          <Alert className='text-center mt-4' variant='success'>Congrats, you just created a new post!</Alert>
          <h5 className='text-center mb-4'>Track the activity on your post in <NavLink to='/'>My account</NavLink></h5>
        </Card>
      </Container>
  )
}
