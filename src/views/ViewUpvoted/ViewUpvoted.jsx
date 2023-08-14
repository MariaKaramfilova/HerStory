import React, { useState, useEffect } from "react";
import { Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUserByUsername } from "../../services/users.services";
import PropTypes from "prop-types";

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
        Voted By
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
              There are no upvotes for this post yet!
            </li>
          )}
        </ul>
      </Card.Body>
    </Card>
  );
}

ViewUpvoted.propTypes = {
  children: PropTypes.array.isRequired,
};
