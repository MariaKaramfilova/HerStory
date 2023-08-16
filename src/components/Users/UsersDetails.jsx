import React, { useContext, useEffect, useState } from 'react'
import { Badge, Container } from 'react-bootstrap'
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BlockUserButton from "../../views/BlockUserButton/BlockUserButton.jsx";
import MakeAdminButton from "../../views/MakeAdminButton/MakeAdminButton.jsx";
import { PostsContext } from '../../context/PostsContext.js';
import _ from 'lodash';
import Error from '../../views/Error/Error.jsx';

/**
 * Component for displaying user details and actions.
 *
 * This component displays information about a user, such as their profile picture,
 * name, username, email address, user since date, and user post count. It also provides
 * actions like blocking the user, making them an admin, and viewing their details.
 *
 * @component
 * @param {Object} user - The user object containing user details.
 * @returns {JSX.Element} Rendered component for displaying user details and actions.
 * @example
 * return (
 *   <UsersDetails user={userDetails} />
 * );
 */
export default function UsersDetails(user) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postsCount, setPostsCount] = useState("");
  const navigate = useNavigate();
  const { allPosts } = useContext(PostsContext);

  useEffect(() => {
    if (_.isEmpty(allPosts)) {
      return;
    }
    setPostsCount(allPosts.filter(el => el.author === user.username).length);

  }, [user, allPosts]);

  const handleGoToDetails = () => {
    navigate(`/account/${user.uid}`);
  };

  if (error) {
    return <Error error={error} />
  }

  return (
    <div className="col-12 col-lg-6 mb-8">
      <Container className="p-6 bg-white rounded shadow mb-8 pt-3">
        <div className="d-flex mb-4 align-items-start justify-content-between">
          <div className="d-flex align-items-center">
            <img
              src={user.profilePictureURL}
              className="me-4 img-fluid rounded-circle img-thumbnail"
              style={{ width: "5em", height: "5em" }}
            />
            <div className="d-inline align-items-left">
              <h5>{user.firstName + " " + user.lastName}</h5>
              <p className="small text-secondary">{user.username}</p>
              <span className="text-primary rounded small">
                User posts
                <Badge bg="secondary">{postsCount}</Badge>
              </span>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-left">
          <FontAwesomeIcon
            icon={faEnvelope}
            style={{ color: "#c0c6ce", marginRight: "0.5em" }}
          />
          <p className="small text-secondary" style={{ marginRight: "0.5em" }}>
            Email address:
          </p>
          <p className="small">{user.email}</p>
        </div>
        <div className="d-flex align-items-left">
          <FontAwesomeIcon
            icon={faCircleUser}
            style={{ color: "#c0c6ce", marginRight: "0.5em" }}
          />
          <p className="small text-secondary" style={{ marginRight: "0.5em" }}>
            User since:{" "}
          </p>
          <p className="small">{moment(user.createdOn).toString()}</p>
        </div>
        <div className="d-flex align-items-left mb-4 pb-3">
          <BlockUserButton user={user} />
          <MakeAdminButton user={user} />
          <Button variant="danger" onClick={handleGoToDetails}>
            View details
          </Button>{" "}
        </div>
      </Container>
    </div>
  );
}

UsersDetails.propTypes = {
  user: PropTypes.object,
};
