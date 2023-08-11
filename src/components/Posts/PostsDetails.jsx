import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Image, Button} from "react-bootstrap";
import { getUserByUsername } from "../../services/users.services";
import { Link, useNavigate } from "react-router-dom";
import { upvotePost } from "../../services/post.services";
import { downvotePost } from "../../services/post.services";
import { AuthContext } from "../../context/AuthContext";
import { deletePost } from "../../services/post.services";
import  ViewUpvoted  from "../../views/ViewUpvoted/ViewUpvoted";
import './PostDetails.css';
import PostTags from "../PostTags/PostTags.jsx";
import PostUpvotes from "./PostUpvotes";

export default function PostsDetails({ ...post }) {

  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState('');
  const [userRole, setUserRole] = useState('');
  const [typeFile, setTypeFile] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const { user, loggedInUser } = useContext(AuthContext);

  // const handleVote = async (voteType) => {
  //   try {
  //     if (voteType === "up") {
  //       if (userVote === "up") {
  //         await downvotePost(loggedInUser.username, post.postId);
  //         setUserVote(null);
  //       } else {
  //         await upvotePost(loggedInUser.username, post.postId);
  //         setUserVote("up");
  //       }
  //     } else if (voteType === "down") {
  //       if (userVote === "down") {
  //         await downvotePost(loggedInUser.username, post.postId);
  //         setUserVote(null);
  //       } else {
  //         await downvotePost(loggedInUser.username, post.postId);
  //         setUserVote("down");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating votes:", error);
  //   }
  // };


  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getUserByUsername(post.author);
        const userData = snapshot.val();
        setAuthorData(userData);
        if (loggedInUser) {
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

  }, [loggedInUser]);

  if (isDeleted) {
    return <div></div>
  }

  const handleDeletePost = async () => {
    try {
      await deletePost(post.postId)
      alert('Post successfully deleted.');
      setIsDeleted(true);
    } catch (error) {
      alert(`Something went wrong ${error}`);
    }
  }

  const limitContent = (content) => {
    const words = content.split(' ');
    if (words.length > 200) {
      return words.slice(0, 200).join(' ') + '...';
    }
    return content;
  };

  return (
    <Card className="mb-3 post-card">
      <Card.Header>
        {authorData && (
          <Link to={`/account/${post.userId}`}>
            <Image
              src={authorData.profilePictureURL}
              alt="Profile Picture"
              roundedCircle
              width={60}
              height={60}
            />
          </Link>
        )}
        <span className="ml-2" style={{ paddingLeft: "5px" }}>
          <Link to={`/account/${post.userId}`}>{post.author}</Link>
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
           {post.content.split(' ').length > 150 ? (
        <>
          {limitContent(post.content)}
          <Button
            type="submit"
            variant="dark"
            onClick={() => navigate(`/detailed-post-view/${post.id}`)}
            style={{ marginTop: "10px" }}
          >
            Continue Reading
          </Button>
        </>
      ) : (
        post.content
      )}
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
          variant="dark"
          onClick={() => navigate(`/detailed-post-view/${post.id}`)}
          style={{ marginRight: "5px" }}
        >
          Comment
        </Button>
        {userRole === 'admin' || authorData.username  && <Button variant="outline-dark" style={{ marginRight: '0.5em' }} onClick={handleDeletePost}>Delete post</Button>}
        <PostTags post={post}/>
      </Card.Body>
      <PostUpvotes post={post}/>
    </Card>
  );
}
