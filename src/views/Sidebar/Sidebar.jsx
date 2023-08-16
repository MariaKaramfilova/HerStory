import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Col, Container, Row, Button } from "react-bootstrap";
import _ from 'lodash';
import { PostsContext } from "../../context/PostsContext.js";
import { AuthContext } from "../../context/AuthContext.js";
import { Link, useNavigate } from "react-router-dom";
import Error from "../Error/Error.jsx";
import { MESSAGE_ABOUT_NUMBER_POSTS, MESSAGE_ABOUT_NUMBER_USERS, POPULAR_TOPICS } from "../../common/common.js";

/**
 * The SideBar component displays user and post statistics along with popular topics.
 *
 * @component
 * @returns {JSX.Element} - JSX representing the SideBar component.
 */
function SideBar() {
  const [forumUsers, setForumUsers] = useState("");
  const [forumPosts, setForumPosts] = useState("");
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
    return <Error error={error} />;
  }

  return (
    <div className="container-fluid" style={styles.container}>
      
      <div className="row align-items-center">
        <div className="col-auto min-vh-100 w-100 bg-light py-4 px-4">
          <Container style={{ height: "30px" }}>
            {!forumUsers || !forumPosts ? (
              <Skeleton />
            ) : (
              <Row>
                <Col>
                  <h6>{forumUsers} {MESSAGE_ABOUT_NUMBER_USERS}</h6>
                </Col>
                <Col>
                  <h6>{forumPosts} {MESSAGE_ABOUT_NUMBER_POSTS}</h6>
                </Col>
              </Row>
            )}
          </Container>
          <hr></hr>

          <ul>
            <h3>{POPULAR_TOPICS}</h3>
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