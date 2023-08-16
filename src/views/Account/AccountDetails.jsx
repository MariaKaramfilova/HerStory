import React, { useContext } from 'react'
import { Card, ListGroup } from 'react-bootstrap';
import BlockUserButton from '../BlockUserButton/BlockUserButton.jsx';
import MakeAdminButton from '../MakeAdminButton/MakeAdminButton.jsx';
import { AuthContext } from '../../context/AuthContext.js';
import PropTypes from "prop-types";

export default function AccountDetails({ userInfo }) {
  const { loggedInUser, user } = useContext(AuthContext);

  return (
    <div className="col-auto">
      <h1>Account Details</h1>
      {user && (
        <Card>
          <Card.Body>
            <Card.Title>{userInfo.username}</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>Email: {userInfo.email}</ListGroup.Item>
              <ListGroup.Item>
                First Name: {userInfo.firstName}
              </ListGroup.Item>
              <ListGroup.Item>
                Last Name: {userInfo.lastName}
              </ListGroup.Item>
              {/* If the createdOn is a timestamp, you can format it accordingly */}
              <ListGroup.Item>
                Created On:{" "}
                {new Date(userInfo.createdOn).toLocaleString()}
              </ListGroup.Item>
            </ListGroup>
            {loggedInUser.role === "admin" && (
              <>
                <BlockUserButton user={userInfo} />
                <MakeAdminButton user={userInfo} />
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

AccountDetails.propTypes = {
  userInfo: PropTypes.object.isRequired,
};


