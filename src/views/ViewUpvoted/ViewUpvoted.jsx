// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUserByUsername } from "../../services/users.services";
import PropTypes from "prop-types";
import { MISSING_VOTED_BY_MESSAGE, VOTED_BY_MESSAGE } from "../../common/common";

/**
 * The ViewUpvoted component displays a list of users who have upvoted a post.
 *
 * @component
 * @param {Array} upvotedBy - An array of usernames of users who upvoted the post.
 * @returns {JSX.Element} - JSX representing the ViewUpvoted component.
 */
export default function ViewUpvoted({ upvotedBy }) {
  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    const fetchUsersData = async () => {
      const usersDataArray = await Promise.all(
        upvotedBy.map(async (username) => {
          const snapshot = await getUserByUsername(username);
          return snapshot.val();

        })
      );
      setUsersData(usersDataArray);
    };

    fetchUsersData();
  }, [upvotedBy]);

  return (
    <Card>
      <Card.Header style={{ textAlign: "center", fontSize: "40px" }}>
        {VOTED_BY_MESSAGE}
      </Card.Header>
      <Card.Body>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {usersData.length > 0 ? (
            usersData.map((user) => (
              <li
                key={user.userId}
                style={{
                  fontSize: "30px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Link to={`/account/${user.uid}`}>
                  <Image
                    src={user.profilePictureURL}
                    alt={`Profile Picture of ${user.username}`}
                    roundedCircle
                    width={50}
                    height={50}
                    style={{ marginRight: "10px" }}
                  />
                </Link>
                <Link to={`/account/${user.uid}`}>{user.username}</Link>
              </li>
            ))
          ) : (
            <li style={{ fontSize: "20px" }}>
              {MISSING_VOTED_BY_MESSAGE}
            </li>
          )}
        </ul>
      </Card.Body>
    </Card>
  );
}
ViewUpvoted.propTypes = {
  upvotedBy: PropTypes.array.isRequired,
};
