import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { SUCCESS_REGISTER_MESSAGE } from '../../common/common'

/**
 * The SuccessRegister component displays a success message after creating an account on the HerStory forum.
 *
 * @component
 * @returns {JSX.Element} - JSX representing the SuccessRegister component.
 */
export default function SuccessRegister() {
  return (
    <Container className='w-100 mt-3' style={{ minHeight: "100vh", maxWidth: "80%", marginLeft: "0"  }}>
        <Card className=' border border-0 mx-auto my-auto'>
          <h2 className='mt-4'>{SUCCESS_REGISTER_MESSAGE}</h2>
          <h5 className='mb-4'>Track the activity on your post in <NavLink to='/my-account'>My account</NavLink></h5>
        </Card>
      </Container>
  )
}
