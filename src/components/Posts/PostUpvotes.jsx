import React from 'react'
import { Button } from 'react-bootstrap/lib/InputGroup';

const { user } = useContext(AuthContext);

const handleVote = async (voteType) => {
    try {
      if (voteType === "up") {
        if (userVote === "up") {
          await downvotePost(username, post.postId);
          setUserVote(null);
        } else {
          await upvotePost(username, post.postId);
          setUserVote("up");
        }
      } else if (voteType === "down") {
        if (userVote === "down") {
          await downvotePost(username, post.postId);
          setUserVote(null);
        } else {
          await downvotePost(username, post.postId);
          setUserVote("down");
        }
      }
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

export default function PostUpvotes() {
    return (
        <>
          {user ? (
          <Button
            type="submit"
            variant={postUpvoted.includes(username) || userVote === 'up' ? 'danger' : 'dark'}
            onClick={() => handleVote("up")}
            style={{ marginRight: "7px" }}
          >
            ▲
          </Button>
        ) : (
          <Button
            style={{ marginRight: "7px" }}
            variant={"dark"}
            onClick={() => {
              navigate("/log-in");
            }}
          >
            ▲
          </Button>
        )}
        <span
          style={{ marginRight: "7px" }}
        >
          {likesCount}
        </span>
        {post.upvotedBy && (
          <span style={{ cursor: "pointer", marginRight: "7px" }} onClick={() => {
            setShowUpvoted(true);
          }}>
            Upvote
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
        {user ? (
         <Button
         type="submit"
         variant={!postUpvoted.includes(username) && userVote === 'down' ? 'danger' : 'dark'}
         onClick={() => handleVote("down")}
         style={{ marginRight: "15px" }}
       >
         ▼
       </Button>
        ) : (
          <Button
            style={{ marginRight: "15px" }}
            variant={"dark"}
            onClick={() => {
              navigate("/log-in");
            }}
          >
            ▼
          </Button>
        )}
            </>
      );
}
