import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/users.services.js";
import { Container } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { useNavigate, useParams } from "react-router-dom";
import UsersDetails from "./UsersDetails.jsx";
import PropTypes from "prop-types";

export default function Users({ searchTerm }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let result;
    setLoading(true);

    getAllUsers()
      .then((data) => {
        if (params.type.includes("username")) {
          result = data.filter((el) =>
            el.username.toLowerCase().startsWith(searchTerm.toLowerCase())
          );
        } else if (params.type.includes("email")) {
          console.log(data);
          result = data.filter((el) =>
            el.email.toLowerCase().startsWith(searchTerm.toLowerCase())
          );
        } else if (params.type.includes("-name")) {
          result = data.filter(
            (el) =>
              el.firstName.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
              el.lastName.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
              el.firstName.toLowerCase() + " " + el.lastName.toLowerCase() ===
                searchTerm.toLowerCase()
          );
        }
        setUsers(result);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [params.type, searchTerm]);

  // Need to fix this with error pages - check for lib
  if (error) {
    return <h1>Error!!! {error.message}</h1>;
  }

  const usersToShow = users.length ? (
    users.map((user) => {
      const userDetailsProp = { ...user };
      return <UsersDetails key={crypto.randomUUID()} {...userDetailsProp} />;
    })
  ) : (
    <div>
      <p>No users to show</p>
    </div>
  );

  return (
    <Container>
      {loading && !users.length ? (
        <Skeleton height={300} count={5} style={{ marginBottom: "20px" }} />
      ) : (
        usersToShow
      )}
    </Container>
  );
}

Users.propTypes = {
  searchTerm: PropTypes.string,
};
