// eslint-disable-next-line no-unused-vars
import React, { useContext } from "react";
import { Card, ListGroup } from "react-bootstrap";
import BlockUserButton from "../BlockUserButton/BlockUserButton.jsx";
import MakeAdminButton from "../MakeAdminButton/MakeAdminButton.jsx";
import { AuthContext } from "../../context/AuthContext.js";
import { ACCOUNT_DETAILS, ADMIN } from "../../common/common.js";
import PropTypes from "prop-types";

/**
 * Component for displaying user account details.
 *
 * Displays user information like username, email, first name, last name, and creation date.
 * If the logged-in user is an admin, also displays buttons to block/unblock and make/unmake admin.
 *
 * @component
 * @param {object} userInfo - User information object to display.
 * @returns {JSX.Element} Rendered component displaying user account details.
 * @example
 * return (
 *   <AccountDetails userInfo={userDetails} />
 * );
 */
export default function AccountDetails({ userInfo }) {
  const { loggedInUser, user } = useContext(AuthContext);

  return (
    <div className="col-auto">
      <h1>{ACCOUNT_DETAILS}</h1>
      {user && (
        <Card>
          <Card.Body>
            <Card.Title>{userInfo.username}</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>Email: {userInfo.email}</ListGroup.Item>
              <ListGroup.Item>First Name: {userInfo.firstName}</ListGroup.Item>
              <ListGroup.Item>Last Name: {userInfo.lastName}</ListGroup.Item>
              <ListGroup.Item>
                Created On: {new Date(userInfo.createdOn).toLocaleString()}
              </ListGroup.Item>
            </ListGroup>
            {loggedInUser.role === ADMIN && (
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
}

AccountDetails.propTypes = {
  userInfo: PropTypes.object.isRequired,
};
