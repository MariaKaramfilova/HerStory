// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { blockUser, unblockUser } from '../../services/users.services.js';
import { Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import Error from '../Error/Error.jsx';

/**
 * The BlockUserButton component provides a button to block or unblock a user.
 *
 * @param {Object} user - The user object containing user details.
 * @param {string} user.username - The username of the user.
 * @param {boolean} user.blockedStatus - The blocked status of the user.
 * @returns {JSX.Element} - JSX representing the BlockUserButton component.
 */
export default function BlockUserButton({ user }) {
  const [blockedStatus, setBlockedStatus] = useState(user.blockedStatus);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  /**
   * Handles the blocking action for the user.
   */
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

  /**
     * Handles the unblocking action for the user.
     */
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

  if (error) {
    return <Error error={error} />;
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

BlockUserButton.propTypes = {
  user: PropTypes.object.isRequired,
};
