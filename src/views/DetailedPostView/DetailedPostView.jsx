import {
  createComment,
  getCommentsByPostHandle,
  getPostById,
  deletePost,
  getAllPosts,
} from "../../services/post.services";
import { Alert, Button, Form, Image, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext.js";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Comment from "../../components/Comments/Comments";
import PostTags from "../PostTags/PostTags.jsx";
import PostUpvotes from "../PostUpvotes/PostUpvotes.jsx";
import Skeleton from "react-loading-skeleton";
import _ from "lodash";
import { PostsContext } from "../../context/PostsContext.js";

/**
 * The DetailedPostView component displays detailed information about a specific post.
 *
 * @returns {JSX.Element} - JSX representing the DetailedPostView component.
 */
export default function DetailedPostView() {
  const { loggedInUser, user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [commentsLibrary, setCommentsLibrary] = useState([]);
  const [refreshComments, SetRefreshComments] = useState(true);
  const [post, setPost] = useState("");
  const [typeFile, setTypeFile] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(
    loggedInUser ? loggedInUser.userRole : null
  );
  const [userName, setUserName] = useState(
    loggedInUser ? loggedInUser.username : null
  );
  const { allPosts, setAllPosts } = useContext(PostsContext);

  const params = useParams();
  const currentPostID = params.id;

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const currentPost = await getPostById(currentPostID);
        const updatedPost = {
          ...currentPost,
          upvotedBy: currentPost.upvotedBy
            ? Object.keys(currentPost.upvotedBy)
            : [],
          downvotedBy: currentPost.downvotedBy
            ? Object.keys(currentPost.downvotedBy)
            : [],
        };

        setPost(updatedPost);

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
        const comments = await getCommentsByPostHandle(currentPostID);
        setCommentsLibrary(comments);
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshComments, currentPostID, post.file]);

  const postDate = new Date(post.createdOn);

  /**
   * Submits a comment.
   * @param {Event} e - The event object.
   */
  async function submitComment(e) {
    e.preventDefault();
    if (loggedInUser.blockedStatus) {
      setError("You cannot add comments because you are a blocked user!");
      return;
    }

    if (_.isEmpty(loggedInUser)) {
      alert("You need to login to add comments!");
      return;
    }

    try {
      await createComment(
        comment,
        loggedInUser.username,
        post.postId,
        loggedInUser.uid
      );
      alert("comment submitted");
      setComment("");
      SetRefreshComments(!refreshComments);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Handles editing the post.
   * @param {Event} e - The event object.
   */
  function handleEdit(e) {
    e.preventDefault();
    navigate(`/edit-post/${currentPostID}`);
  }

  /**
   * Handles deleting the post.
   * @param {Event} e - The event object.
   */
  async function handleDeletePost(e) {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (confirmDelete) {
      try {
        await deletePost(currentPostID);
        let result = await getAllPosts()
        setAllPosts((prev) => ({ ...prev, allPosts: result }));
        alert('Your post has been deleted!')
        navigate('/home')
      } catch (error) {
        alert(error);
      }
    }
  }

  const commentsToShow =
    commentsLibrary.length > 0 ? (
      commentsLibrary.map((comment) => (
        <Comment
          key={crypto.randomUUID()}
          author={comment.author}
          createdOn={comment.createdOn}
          content={comment.content}
          commentUserUid={comment.userUid}
          commentPostId={comment.postId}
          commentId={comment.commentId}
          SetRefreshComments={SetRefreshComments}
          refreshComments={refreshComments}
        />
      ))
    ) : (
      <p>There are no comments, yet. You can write the first one.</p>
    );

  // if (_.isEmpty(loggedInUser) && loggedInUser !== null) {
  //   return;
  // }

  return (
    <div className="container-auto mt-3">
      <div className="container-auto mt-3">
        <div className="row">
          <div className="col-8">
            {loading ? (
              <Skeleton width={100} />
            ) : (
              <h6>
                Posted by{" "}
                <Link to={`/account/${post.userId}`}>
                  {post.author}
                </Link>{" "}
                on {postDate.toLocaleString()} | {post.topic}
              </h6>
            )}
          </div>
          {(userRole === 'admin' || post.author === userName) && (
            <div className="col-4 text-right">
              <Link className="mt-1 mr-2 py-1 px-2 text-dark text-decoration-underline" to="#" onClick={handleEdit}>Edit Post</Link>
              <Link className="mt-1 py-1 px-2 text-dark text-decoration-underline" to="#" onClick={handleDeletePost}>Delete Post</Link>
            </div>
          )}
        </div>
        <hr /> {/* Line */}
      </div>

      <div className="container mt-1">
        <div className="mx-auto" style={{ maxWidth: '97%' }}>
          <h1>{loading ? <Skeleton width={200} /> : post.title}</h1>
          {loading ? (
            <Skeleton count={3} />
          ) : (
            <>
              <hr />
              <p>{post.content}</p>
              <div className={`media-element ${typeFile}`}>
                {typeFile === "image" && (
                  <div className="media-element" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Image src={post.file} style={{ height: '320px', width: 'auto' }} />
                  </div>
                )}
                {typeFile === "video" && (
                  <div className="media-element" style={{ display: 'flex', justifyContent: 'center' }}>
                    <video controls style={{ height: '320px', width: 'auto' }}>
                      <source src={post.file} type="video/mp4" />
                    </video>
                  </div>
                )}
              </div>
              <hr />
            </>
          )}
        </div>
      </div>

      {loggedInUser ? (
        <div className="row">
          <div className="col-2">{post && <PostUpvotes post={post} />}</div>

          <div className="col-8">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Add Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="mb-3"
              />
            </Form.Group>
          </div>

          <div className="col-2">
            <Button type="submit" variant="dark" onClick={submitComment}>
              Add Comment
            </Button>
          </div>
        </div>
      ) : (
        <>
          {" "}
          <hr />
          <p>
            {" "}
            Log in to write a comments, upvote or downvote posts and be part of
            our community.{" "}
          </p>{" "}
        </>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {post && <PostTags post={post} />}

      {loading ? (
        <Skeleton count={5} height={40} />
      ) : (
        <>
          <hr />
          <h2>Comments:</h2>
          {commentsToShow}
        </>
      )}
    </div>
  );
}
