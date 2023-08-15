import React, { useContext, useEffect, useState } from 'react'
import { Badge, Container } from 'react-bootstrap'
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Button } from "react-bootstrap";
import { blockUser, unblockUser } from "../../services/users.services.js";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../../services/post.services.js";
import BlockUserButton from "../../views/BlockUserButton/BlockUserButton.jsx";
import MakeAdminButton from "../../views/MakeAdminButton/MakeAdminButton.jsx";
import { PostsContext } from '../../context/PostsContext.js';

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

  // Need to fix this with error pages - check for lib
  if (error) {
    return <h1>Error!!! {error.message}</h1>;
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
