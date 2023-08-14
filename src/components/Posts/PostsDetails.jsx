import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Image, Button } from "react-bootstrap";
import { getUserByUsername } from "../../services/users.services";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { deletePost } from "../../services/post.services";
import './PostDetails.css';
import PostTags from "../PostTags/PostTags.jsx";
import PostUpvotes from "./PostUpvotes";


export default function PostsDetails({ ...post }) {

  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [typeFile, setTypeFile] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const { user, loggedInUser } = useContext(AuthContext);


  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getUserByUsername(post.author);
        const userData = snapshot.val();
        setAuthorData(userData);
        if (loggedInUser) {
          setUserRole(loggedInUser.role);
          setUserName(loggedInUser.username)
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

  const handleDeletePost = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');

    if(confirmDelete){
      try {
        await deletePost(post.postId)
        alert('Post successfully deleted.');
        setIsDeleted(true);
      } catch (error) {
        alert(`Something went wrong ${error}`);
      }
    }
  }

  const limitContent = (content) => {
    const words = content.split(' ');
    if (words.length > 100) {
      return words.slice(0, 100).join(' ') + '...';
    }
    return content;
  };

  return (
    
    <Card className="mb-3 post-card" style={{ maxWidth: "100%" }}>
      <Card.Header className="d-flex justify-content-between align-items-center" >
      <div>
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
      </div>
      {(userRole === "admin" || userName === post.author) && (
        <Button variant="outline-dark" onClick={handleDeletePost}>
          Delete post
        </Button>
      )}
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
                variant="outline-dark"
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
       
          {typeFile === "image" && (
            <div className="media-element" style={{ display: 'flex', justifyContent: 'center' }}>
              <Image src={post.file} style={{ height: '320px', width: 'auto%', }} />
            </div>
          )}
            {typeFile === "video" && (
            <div className="media-element" style={{ display: 'flex', justifyContent: 'center' }}>
              <video controls style={{ height: '320px', width: 'auto%', }}>
                <source src={post.file} type="video/mp4" />
              </video>
            </div>
          )}
         
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center mt-3">
    <div>
      <Button
        type="submit"
        variant="dark"
        onClick={() => navigate(`/detailed-post-view/${post.id}`)}
      >
        Comment
      </Button>
  
    </div>
    <PostTags post={post} />
    {post && <PostUpvotes post={post} />}
  </div>
</Card.Body>
</Card>
  );
}
