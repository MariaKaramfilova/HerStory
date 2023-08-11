import React, { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../../services/post.services.js";
import { getAllUsers } from "../../services/users.services.js";
import Skeleton from "react-loading-skeleton";
import { Col, Container, Row } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext.js";

function SideBar(props) {
  const [forumUsers, setForumUsers] = useState('');
  const [forumPosts, setForumPosts] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let loadingCount = 0;
    setLoading(true);
    setError(false);
    loadingCount++;

    getAllPosts()
      .then(snapshot => {
        const formatter = Intl.NumberFormat("en", { notation: "compact" });
        setForumPosts(formatter.format(snapshot.length));
      })
      .catch(err => setError(err))
      .finally(() => {
        loadingCount--;
        if (loadingCount === 0) {
          setLoading(false);
        }
      });

    loadingCount++;
    getAllUsers()
      .then(snapshot => {
        const formatter = Intl.NumberFormat("en", { notation: "compact" });
        setForumUsers(formatter.format(snapshot.length));
      })
      .catch(err => setError(err))
      .finally(() => {
        loadingCount--;
        if (loadingCount === 0) {
          setLoading(false);
        }
      });
  }, []);

  const femaleRightsTopics = [
    "Gender Equality",
    "Reproductive Rights",
    "Violence Against Women",
    "Equal Pay",
    "Maternity Leave",
    "Women's Education",
  ];

  let id = 1;
  function randomID() {
    return id++
  }

  if (error) {
    return <div>Error {error}</div>
  }

  return (
    <div className="container-fluid" style={styles.container}>
      <div className="row align-items-center" >
        <div className="col-auto min-vh-100 w-100 bg-light py-4 px-4"  >
          <Container style={{ height: "30px" }}>
            {loading ? <Skeleton /> : <Row>
              <Col><h6>{forumUsers} Users</h6></Col>
              <Col><h6>{forumPosts} Posts</h6></Col>
            </Row>}
          </Container>
          <hr></hr>

          <ul>
            <h3>Popular Topics</h3>
            <ul>
              {femaleRightsTopics.map((topic) => (
                <div key={randomID()}>
                  <h6>{topic}</h6>
                </div>
              ))}
            </ul>
          </ul>
          <hr></hr>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    lineHeight: '3em',
  },
};

export default SideBar;