import React, { useState, useEffect } from "react";
import moment from "moment";
import { Card, Image, Button, Modal} from "react-bootstrap";
import { getUserByUsername } from "../../services/users.services";
import MyAccount from "../../views/Account/Account";
import { useNavigate } from "react-router-dom";
import { upvotePost } from "../../services/post.services";
import { downvotePost } from "../../services/post.services";
import { getUserData } from "../../services/users.services";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { deletePost } from "../../services/post.services";
import  ViewUpvoted  from "../../views/ViewUpvoted/ViewUpvoted";
import './PostDetails.css';
export default function PostsDetails({ goToDetails, ...post }) {
  const [authorData, setAuthorData] = useState(null);
  const [typeFile, setTypeFile] = useState("");
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [userVote, setUserVote] = useState(null);
  const [username, setUsername] = useState("");
  const [postUpvoted, setPostUpvoted] = useState('')
  const [showUpvoted, setShowUpvoted] = useState('')
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const snapshot = await getUserData(user.uid);
        const userData = snapshot.val();
        const profileData = Object.values(userData).find(
          (el) => el.uid === user.uid
        );

        if (profileData) {
          setUsername(profileData.username);
          setPostUpvoted(post.upvotedBy);
          setLikesCount(post.upvotedBy.length)
        }
      } catch (error) {
        console.error("Error fetching profile picture URL:", error);
      }
    };

    if (user) {
      getProfileData();
    }
  }, [user, postUpvoted, likesCount]);


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
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const snapshot = await getUserByUsername(post.author);
        const userData = snapshot.val();
        setAuthorData(userData);
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
        setUserVote(postUpvoted.includes(username) ? "up" : 'down');
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };
    fetchAuthorData();
  }, [username, typeFile, likesCount, userVote]);

  async function handleDeletePost(e){
    e.preventDefault();
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');

    if(confirmDelete){
        try{
            await deletePost(post.postId);
            alert('Your post has been deleted!')
            navigate('/home')
        } catch (error){
            alert(error)
        }
    }
    
}
  if (false) {
    return <MyAccount userName={post.userName} />;
  }
  return (
    <Card className="mb-3 post-card">
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
        <Button
          type="submit"
          variant="dark"
          onClick={() => navigate(`/detailed-post-view/${post.id}`)}
          style={{ marginRight: "5px" }}
        >
          Comment
        </Button>
        {username === post.author && ( 
        <Button
          type="submit"
          variant="dark"
          onClick={handleDeletePost}
          style={{ float: 'right' }}
        >
          Delete post
        </Button>)}
      </Card.Body>
    </Card>
  );
}
