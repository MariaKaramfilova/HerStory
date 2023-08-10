import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Image, Button, Alert } from "react-bootstrap";
import { getUserByUsername, getUserData } from "../../services/users.services";
import MyAccount from "../../views/Account/Account";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../services/post.services.js";
import { AuthContext } from "../../context/AuthContext.js";

export default function PostsDetails({ goToDetails, ...post }) {
  const [userRole, setUserRole] = useState('');
  const [authorData, setAuthorData] = useState(null);
  const [typeFile, setTypeFile] = useState("");
  const { user } = useContext(AuthContext);
  const [isDeleted, setIsDeleted] = useState(false);

  const [voteStatus, setVoteStatus] = useState(null);

  const handleVote = (voteType) => {
    if (voteStatus === voteType) {
      setVoteStatus(null);
    } else {
      setVoteStatus(voteType);
    }
  };

  // Need to add better styling for errors
  const handleDeletePost = async () => {

    try {
      await deletePost(post.postId)
      alert('Post successfully deleted.');
      setIsDeleted(true);
    } catch (error) {
      alert(`Something went wrong ${error}`);
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getUserByUsername(post.author);
        const userData = snapshot.val();
        setAuthorData(userData);
        if (user) {
          const loggedUserSnapshot = await getUserData(user.uid);
          const loggedInUser = Object.values(loggedUserSnapshot.val()).find((el) => el.uid === user.uid);
          setUserRole(loggedInUser.role);
        }

        if (post.file) {
          if (post.file.includes("mp4")) {
            setTypeFile("video");
          } else if (
            post.file.includes("images") &&
            !post.file.includes("mp4")
          ) {
            setTypeFile("image");
          }
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    })();

  }, [post, user]);

  if (isDeleted) {
    return <div></div>
  }

  return (
    <Card className="mb-3">
      <Card.Header>
        {authorData && (
          <Image
            src={authorData.profilePictureURL}
            alt="Profile Picture"
            roundedCircle
            width={60}
            height={60}
          />
        )}
        <span className="ml-2" style={{ paddingLeft: "5px" }}>
          {post.author}
        </span>
      </Card.Header>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {moment(post.createdOn).toString()}
        </Card.Subtitle>
        <Card
          style={{
            fontSize: "17px",
            marginTop: "15px",
            backgroundColor: "WhiteSmoke",
            paddingLeft: "5px",
            paddingRight: "5px",
          }}
        >
          {post.content}
        </Card>
        <div className={`media-element ${typeFile}`}>
          <Card>
            {typeFile === "image" && (
              <Image src={post.file} fluid style={{ width: "60%" }} />
            )}
            {typeFile === "video" && (
              <video controls className="media-element">
                <source src={post.file} type="video/mp4" />
              </video>
            )}
          </Card>
        </div>
        <hr />
        <Button
          type="submit"
          variant={voteStatus === "up" ? "danger" : "dark"}
          onClick={() => handleVote("up")}
          style={{ marginRight: "7px" }}
        >
          ▲
        </Button>
        <span
          type="submit"
          onClick={() => navigate(`/detailed-post-view/${post.id}`)}
          style={{ marginRight: "7px" }}
        >
          156
        </span>
        <Button
          type="submit"
          variant={voteStatus === "down" ? "danger" : "dark"}
          onClick={() => handleVote("down")}
          style={{ marginRight: "15px" }}
        >
          ▼
        </Button>
        <Button
          type="submit"
          variant="dark"
          onClick={() => navigate(`/detailed-post-view/${post.id}`)}
          style={{ marginRight: "5px" }}
        >
          Comment
        </Button>
        {userRole === 'admin' && <Button variant="outline-dark" style={{ marginRight: '0.5em' }} onClick={handleDeletePost}>Delete post</Button>}
      </Card.Body>
    </Card>
  );
}
