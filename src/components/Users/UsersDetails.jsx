import React, { useEffect, useState } from 'react'
import { Badge, Container } from 'react-bootstrap'
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { blockUser, getUserByUsername, unblockUser } from '../../services/users.services.js';

export default function UsersDetails(user, goToDetails) {
  const [blockedStatus, setBlockedStatus] = useState(user.blockedStatus);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   setError(null);

  //   getUserByUsername(user.username)
  //     .then(data => setBlockedStatus(data.blockedStatus))
  //     .catch(err => setError(err))
  //     .finally(() => setLoading(false))
  // }, []);

  const handleBlock = async () => {
    setLoading(true);
    try {
      blockUser(user.username);
      setBlockedStatus(true);
      setLoading(false);
    } catch (error) {
      setError(error)
    }
  }

  const handleUnblock = async () => {
    setLoading(true);
    try {
      unblockUser(user.username);
      setLoading(false);
      setBlockedStatus(false);
    } catch (error) {
      setError(error)
    }
  }

  // Need to fix this with error pages - check for lib
  if (error) {
    return <h1>Error!!! {error.message}</h1>
  }

  return (
    <div className='col-12 col-lg-6 mb-8'>
      <Container className='p-6 bg-white rounded shadow mb-8 pt-3'>
        <div className='d-flex mb-4 align-items-start justify-content-between'>
          <div className='d-flex align-items-center'>
            <img src={user.profilePictureURL} className='me-4 img-fluid rounded-circle img-thumbnail' style={{ width: "5em", height: "5em" }} />
            <div className='d-inline align-items-left'>
              <h5>{user.firstName + " " + user.lastName}</h5>
              <p className='small text-secondary'>{user.username}</p>
              <span className='text-primary rounded small'>
                User posts
                <Badge bg="secondary">9</Badge>
              </span>
            </div>
          </div>
        </div>
        <div className='d-flex align-items-left'>
          <FontAwesomeIcon icon={faEnvelope} style={{ color: "#c0c6ce", marginRight: '0.5em' }} />
          <p className='small text-secondary' style={{ marginRight: '0.5em' }}>Email address:</p>
          <p className='small'>{user.email}</p>
        </div>
        <div className='d-flex align-items-left'>
          <FontAwesomeIcon icon={faCircleUser} style={{ color: "#c0c6ce", marginRight: '0.5em' }} />
          <p className='small text-secondary' style={{ marginRight: '0.5em' }}>User since: </p>
          <p className='small'>{moment(user.createdOn).toString()}</p>
        </div>
        <div className='d-flex align-items-left mb-4 pb-3'>
          {blockedStatus ? (
            <Button variant="outline-dark" style={{ marginRight: '0.5em' }} onClick={handleUnblock}>Unblock user</Button>
          ) : (
            <Button variant="dark" style={{ marginRight: '0.5em' }} onClick={handleBlock}>Block user</Button>)
          }
          <Button variant="danger">View details</Button>{' '}
        </div>
      </Container>
    </div>
  )
}

UsersDetails.propTypes = {
  user: PropTypes.object.isRequired,
};
