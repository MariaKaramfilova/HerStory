import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { downvotePost } from "../../services/post.services";
import { upvotePost } from "../../services/post.services";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ViewUpvoted from "../../views/ViewUpvoted/ViewUpvoted";
import _ from 'lodash';

export default function PostUpvotes({ post }) {
  const navigate = useNavigate();
  const { user, loggedInUser } = useContext(AuthContext);
  const [vote, setVote] = useState(_.compact(post.upvotedBy).length);
  const [showUpvoted, setShowUpvoted] = useState('');
  const [isUpDisabled, setIsUpDisabled] = useState(false);
  const [isDownDisabled, setIsDownDisabled] = useState(false);

  useEffect(() => {
    if (user) {
      if (_.compact(post.upvotedBy).includes(loggedInUser.username)) {
        setIsUpDisabled(true);
      } else if (_.compact(post.downvotedBy).includes(loggedInUser.username)) {
        setIsDownDisabled(true);
      } else if (!post.upvotedBy && !post.downvotedBy) {
        setIsDownDisabled(false);
        setIsUpDisabled(false);
      }
    }
  }, [user, loggedInUser, post]);


  const handleClick = (direction) => {
    if (user) {
      if (direction === 'up') {
        upVote()
        setIsUpDisabled(true);
        setIsDownDisabled(false);
      } else {
        downVote();
        setIsUpDisabled(false);
        setIsDownDisabled(true);
      }
    } else {
      navigate('/log-in')
    }
  };

  const upVote = async () => {
    try {
      setVote((prev) => prev + 1);
      await upvotePost(loggedInUser.username, post.postId);
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  const downVote = async () => {
    try {
      setVote((prev) => prev - 1);
      await downvotePost(loggedInUser.username, post.postId);
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  const isAuthorOrAdmin = loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.username === post.author);

  return (
    <div className="d-flex">
      <Button
        type="submit"
        //   variant={
        //     postUpvoted.includes(loggedInUser.username) || userVote === "up"
        //       ? "danger"
        //       : "dark"
        //   }
        onClick={() => {
          handleClick('up')
        }}
        variant="dark"
        disabled={isUpDisabled}
        style={{ marginRight: "7px" }}>
        ▲
      </Button>

      <span style={{ marginRight: "7px" }}>{vote}</span>

      {isAuthorOrAdmin && post.upvotedBy ? (
        <span
          style={{ cursor: "pointer", marginRight: "7px" }}
          onClick={() => {
            setShowUpvoted(true);
          }}
        >
          Votes
        </span>
      ) : (
      <span
        style={{ cursor: "pointer", marginRight: "7px" }}
      >
        Votes
      </span>)}
      {showUpvoted && (
        <Modal show={showUpvoted} onHide={() => setShowUpvoted(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Upvoted By</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ViewUpvoted upvotedBy={post.upvotedBy} /> 
          </Modal.Body>
        </Modal>
      )}
      <Button
        type="submit"
        onClick={() => {
          handleClick('down');
        }}
        disabled={isDownDisabled}
        variant="dark"
        style={{ marginRight: "15px" }}
      >
        ▼
      </Button>
    </div>
  );
}
