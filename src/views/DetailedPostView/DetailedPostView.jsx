import { createComment, getCommentsByPostHandle, getPostById, deletePost, getAllPosts } from "../../services/post.services";
import { Alert, Button, Form, Image } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext.js';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import Comment from "../../components/Comments/Comments";
import PostTags from "../../components/PostTags/PostTags.jsx";
import PostUpvotes from "../../components/Posts/PostUpvotes.jsx";
import Skeleton from 'react-loading-skeleton';
import _ from 'lodash';
import { PostsContext } from "../../context/PostsContext.js";

export default function DetailedPostView() {

  const { loggedInUser, user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [commentsLibrary, setCommentsLibrary] = useState([]);
  const [refreshComments, SetRefreshComments] = useState(true);
  const [post, setPost] = useState('');
  const [typeFile, setTypeFile] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(loggedInUser ? loggedInUser.userRole : null);
  const [userName, setUserName] = useState(loggedInUser ? loggedInUser.username : null);
  const { allPosts, setAllPosts } = useContext(PostsContext);

  const params = useParams();
  const currentPostID = params.id;

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getPostById(currentPostID)
      .then(currentPost => {
        const updatedPost = {
          ...currentPost,
          upvotedBy: currentPost.upvotedBy ? Object.keys(currentPost.upvotedBy) : [],
          downvotedBy: currentPost.downvotedBy ? Object.keys(currentPost.downvotedBy) : [],
        }

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
        return getCommentsByPostHandle(currentPostID);
      })
      .then(comments => {
        setCommentsLibrary(comments);
      })
      .catch(error => {
        console.error('Error fetching post and comments:', error);
      })
      .finally(() => setLoading(false));
  }, [refreshComments, currentPostID, post.file]);

  const postDate = new Date(post.createdOn);

  async function submitComment(e) {
    e.preventDefault();
    if (loggedInUser.blockedStatus) {
      setError('You cannot add comments because you are a blocked user!');
      return;
    }

    if (_.isEmpty(loggedInUser)) {
      alert("You need to login to add comments!");
      return;
    }

    await createComment(comment, loggedInUser.username, post.postId, loggedInUser.uid)
    alert('comment submitted')
    setComment('')
    SetRefreshComments(!refreshComments)
  }

  function handleEdit(e) {
    e.preventDefault();
    navigate(`/edit-post/${currentPostID}`);
  }

  async function handleDeletePost(e) {
    e.preventDefault();
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');

    if (confirmDelete) {
      try {
        await deletePost(currentPostID);
        let result = await getAllPosts();
        setAllPosts((prev) => ({ ...prev, allPosts: result }));
        alert('Your post has been deleted!')
        navigate('/home')
      } catch (error) {
        alert(error)
      }
    }

  }

  const commentsToShow = commentsLibrary.length > 0 ? (
    commentsLibrary.map((comment) => (
      <Comment key={crypto.randomUUID()} author={comment.author} createdOn={comment.createdOn} content={comment.content}
        commentUserUid={comment.userUid} commentPostId={comment.postId} commentId={comment.commentId} SetRefreshComments={SetRefreshComments} refreshComments={refreshComments} />
    ))
  ) : (
    <p>There are no comments, yet. You can write the first one.</p>
  );

  // if (_.isEmpty(loggedInUser) && loggedInUser !== null) {
  //   return;
  // }

  return (

    <div className="container-auto mt-3">

      {/* <h7>{demoPost.topic}</h7> */}
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
          <>
            <div className="col">
              <Button type="submit" className='mt-1' variant="dark" onClick={handleEdit}>Edit Post</Button>
            </div>
            <div className="col">
              <Button type="submit" className='mt-1' variant="dark" onClick={handleDeletePost}>Delete Post</Button>
            </div>
          </>
        )}
      </div>

      <row className="mt-1">

        <h1>{loading ? <Skeleton width={200} /> : post.title}</h1>
        {loading ? (
          <Skeleton count={3} />
        ) : (
          <>
            <p>{post.content}</p>
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
          </>
        )}
      </row>

      {loggedInUser ? (<div className="row">
        <div className="col-2">
          {post && <PostUpvotes post={post} />}
        </div>

        <div className="col-8">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Add Comment"
              value={comment} onChange={(e) => setComment(e.target.value)}
              required className='mb-3' />
          </Form.Group>
        </div>

        <div className="col-2">
          <Button type="submit" variant="danger" onClick={submitComment}>Add Comment</Button>
        </div>
      </div>
      ) : (
        <> <hr />
          <p> Log in to write a comments, upvote or downvote posts and be part of our community. </p>  </>)}
      {error && <Alert variant='danger'>{error}</Alert>}
      {post && <PostTags post={post} />}
      <hr />
      {loading ? (
        <Skeleton count={5} height={40} />
      ) : (
        <>
          <hr />
          <h2>Comments</h2>
          {commentsToShow}
        </>
      )}
    </div>

  )
}

