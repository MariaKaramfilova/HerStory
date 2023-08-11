import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { downvotePost } from "../../services/post.services";
import { upvotePost } from "../../services/post.services";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ViewUpvoted from "../../views/ViewUpvoted/ViewUpvoted";

export default function PostUpvotes({ post }) {
  const navigate = useNavigate();
  const { user, loggedInUser } = useContext(AuthContext);
  const [vote, setVote] = useState(post.upvotedBy.length);
  // const [isButtonDisabled, setIsButtonDisabled] = useState('');
  const [showUpvoted, setShowUpvoted] = useState('');
  const [showUnUpvoted, setShowUnUpvoted] = useState('');
  const [isUpDisabled, setIsUpDisabled] = useState();
  const [isDownDisabled, setIsDownDisabled] = useState();

  useEffect(() => {
    if (loggedInUser) {
      if (post.upvotedBy.includes(loggedInUser.username)) {
        setIsUpDisabled(true);
      } else if (Object.keys(post.downvotedBy).includes(loggedInUser.username)) {
        setIsDownDisabled(true);
      } else {
        setIsDownDisabled(false);
        setIsUpDisabled(false);
      }
    }
  }, [user, loggedInUser]);


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
      await post.upvotedBy.includes(loggedInUser.username);
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
        style={{ marginRight: "7px" }}
      >
        ▲
      </Button>

      <span style={{ marginRight: "7px" }}>{vote}</span>

      {post.upvotedBy && (
        <span
          style={{ cursor: "pointer", marginRight: "7px" }}
          onClick={() => {
            setShowUpvoted(true);
          }}
        >
          Votes
        </span>
      )}
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
