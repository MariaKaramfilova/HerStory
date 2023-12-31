/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { deletePost, getAllPosts } from "../../services/post.services";
import "./PostDetails.css";
import PostTags from "../../views/PostTags/PostTags.jsx";
import PostUpvotes from "../../views/PostUpvotes/PostUpvotes";
import Skeleton from "react-loading-skeleton";
import { PostsContext } from "../../context/PostsContext.js";
import {
  ADMIN,
  COMMENT_BUTTON_MESSAGE,
  DELETE_POST,
} from "../../common/common";

/**
 * A component to display details of a single post.
 *
 * Displays post author information, post content, and related actions such as deleting and navigating to post details.
 *
 * @component
 * @param {object} post - The post object containing post details.
 * @returns {JSX.Element} Rendered component with post details.
 * @example
 * return (
 *   <PostsDetails post={postData} />
 * );
 */
export default function PostsDetails({ ...post }) {
  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [typeFile, setTypeFile] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { user, loggedInUser, allUsers } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const { allPosts, setAllPosts } = useContext(PostsContext);

  useEffect(() => {
    if (allUsers) {
      const userData = allUsers.filter((user) => user.uid === post.userId);
      setAuthorData(userData);
    }
    if (loggedInUser) {
      setUserRole(loggedInUser.role);
      setUserName(loggedInUser.username);
    }

    if (post.file) {
      if (post.file.includes("mp4")) {
        setTypeFile("video");
      } else if (post.file.includes("images") && !post.file.includes("mp4")) {
        setTypeFile("image");
      }
    }
  }, [loggedInUser]);

  if (isDeleted) {
    return <div></div>;
  }

  /**
   * Handle post deletion.
   * @param {Event} e - The click event.
   */
  const handleDeletePost = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (confirmDelete) {
      try {
        await deletePost(post.postId);
        alert("Post successfully deleted.");
        let result = await getAllPosts();
        setAllPosts((prev) => ({ ...prev, allPosts: result }));
        setIsDeleted(true);
      } catch (error) {
        alert(`Something went wrong ${error}`);
      }
    }
  };

  /**
   * Limit post content to a specific word count.
   * @param {string} content - The post content.
   * @returns {string} Limited content.
   */
  const limitContent = (content) => {
    const words = content.split(" ");
    if (words.length > 100) {
      return words.slice(0, 180).join(" ") + "...";
    }
    return content;
  };

  return (
    <>
      {loading || !post ? (
        <Skeleton height={300} style={{ marginBottom: "20px" }} />
      ) : (
        <Card className="mb-3 post-card" style={{ maxWidth: "100%" }}>
          <Card.Header
            className="d-flex justify-content-between align-items-center"
            style={{ minHeight: "50px" }}
          >
            <div>
              {authorData && (
                <Link to={`/account/${post.userId}`}>
                  <Image
                    src={authorData[0].profilePictureURL}
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
            {(userRole === ADMIN || userName === post.author) && (
              <Button variant="outline-dark" onClick={handleDeletePost}>
                {DELETE_POST}
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
                height: "auto",
                minHeight: "250px",
              }}
            >
              {post.content.split(" ").length > 350 ? (
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
              <div className={`media-element ${typeFile}`}>
                {typeFile === "image" && (
                  <div
                    className="media-element"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Image
                      src={post.file}
                      style={{ height: "250px", width: "auto%" }}
                    />
                  </div>
                )}
                {typeFile === "video" && (
                  <div
                    className="media-element"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <video controls style={{ height: "250px", width: "auto%" }}>
                      <source src={post.file} type="video/mp4" />
                    </video>
                  </div>
                )}
              </div>
            </Card>
            <hr />
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <Button
                  type="submit"
                  variant="dark"
                  onClick={() => navigate(`/detailed-post-view/${post.id}`)}
                >
                  {COMMENT_BUTTON_MESSAGE}
                </Button>
              </div>
              <PostTags post={post} />
              {post && <PostUpvotes post={post} />}
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
