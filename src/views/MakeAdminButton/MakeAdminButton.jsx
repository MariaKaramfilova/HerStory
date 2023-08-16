import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { makeAdminUser, removeAdminRights } from '../../services/users.services.js';
import PropTypes from "prop-types";
import Error from '../Error/Error.jsx';
import { ADMIN } from '../../common/common.js';

/**
 * The MakeAdminButton component allows toggling a user's admin status.
 *
 * @param {object} user - The user object for which the admin status is toggled.
 * @returns {JSX.Element} - JSX representing the MakeAdminButton component.
 */
export default function MakeAdminButton({ user }) {
  const [adminStatus, setAdminStatus] = useState(user.role === ADMIN);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMakeAdmin = async () => {
    setLoading(true);
    try {
      makeAdminUser(user.username);
      setAdminStatus(true);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }

  const handleRemoveAdminRights = async () => {
    setLoading(true);
    try {
      removeAdminRights(user.username);
      setLoading(false);
      setAdminStatus(false);
    } catch (error) {
      setError(error)
    }
  }

  if (error) {
    return <Error error={error}/>;
  }

  return (
    <>
      {adminStatus ? (
        <Button variant="success" style={{ marginRight: '0.5em' }} onClick={handleRemoveAdminRights}>Remove admin rights</Button>
        ) : (
        <Button variant="outline-success" style={{ marginRight: '0.5em' }} onClick={handleMakeAdmin} >Make admin</Button >)
      }
    </>
  )
}

MakeAdminButton.propTypes = {
  user: PropTypes.object.isRequired,
};

