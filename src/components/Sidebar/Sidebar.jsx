import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Col, Container, Row, Button } from "react-bootstrap";
import PostsDetails from "../Posts/PostsDetails.jsx";
import _ from 'lodash';
import { PostsContext } from "../../context/PostsContext.js";
import { AuthContext } from "../../context/AuthContext.js";
import Posts from "../Posts/Posts.jsx";
import { Link, useNavigate } from "react-router-dom";

function SideBar() {
  const [forumUsers, setForumUsers] = useState("");
  const [forumPosts, setForumPosts] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const { allPosts } = useContext(PostsContext);
  const { allUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (_.isEmpty(allPosts) || _.isEmpty(allUsers)) {
      return;
    }
    const formatter = Intl.NumberFormat("en", { notation: "compact" });
    setForumPosts(formatter.format(allPosts.length));
    setForumUsers(formatter.format(Object.keys(allUsers).length));

  }, [selectedTopic, allPosts, allUsers]);

  const femaleRightsTopics = [
    "Gender Equality",
    "Reproductive Rights",
    "Violence Against Women",
    "Equal Pay",
    "Maternity Leave",
    "Women's Education",
  ];

  const handleTopicSelect = (topic) => {
    navigate(`/topics/${topic.split(' ').join("")}`);
    return;
  };

  let id = 1;
  function randomID() {
    return id++;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="container-fluid" style={styles.container}>
      
      <div className="row align-items-center">
        <div className="col-auto min-vh-100 w-100 bg-light py-4 px-4">
          <Container style={{ height: "30px" }}>
            {!forumPosts || !forumUsers ? (
              <Skeleton />
            ) : (
              <Row>
                <Col>
                  <h6>{forumUsers} Users</h6>
                </Col>
                <Col>
                  <h6>{forumPosts} Posts</h6>
                </Col>
              </Row>
            )}
          </Container>
          <hr></hr>

          <ul>
            <h3>Popular Topics</h3>
            <ul>
              {femaleRightsTopics.map((topic) => (
                <div key={randomID()}>
                  <Button
                    variant="none"
                    className={selectedTopic === topic ? "selected-topic" : ""}
                    onClick={() => handleTopicSelect(topic)}
                  >
                    {topic}
                  </Button>
                </div>
              ))}
            </ul>
          </ul>
          <hr></hr>
          {/* {filteredPosts.length > 0 ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ marginRight: "10px" }}>{selectedTopic}</h3>
                <Button onClick={() => setSelectedTopic("")} variant="dark">
                  Clear
                </Button>
              </div>
              {filteredPosts.map((post) => (
                <PostsDetails key={post.postId} {...post} />
              ))}
            </>
          ) : selectedTopic ? (
            <h3 style={{ textAlign: "center" }}>
              There are no posts on {selectedTopic}
            </h3>
          ) : (
            ""
          )} */}
        </div>

      </div>
      
    </div>
  );
}

const styles = {
  container: {
    lineHeight: "3em",
  },
};

export default SideBar;

