import React, { useState } from 'react'
import { blockUser, unblockUser } from '../../services/users.services.js';
import { Button } from 'react-bootstrap';

export default function BlockUserButton({ user }) {
  const [blockedStatus, setBlockedStatus] = useState(user.blockedStatus);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {blockedStatus ? (
        <Button variant="outline-dark" style={{ marginRight: '0.5em' }} onClick={handleUnblock} > Unblock user</Button >
      ) : (
        <Button variant="dark" style={{ marginRight: '0.5em' }} onClick={handleBlock}>Block user</Button>)
      }
    </>
  )
}
