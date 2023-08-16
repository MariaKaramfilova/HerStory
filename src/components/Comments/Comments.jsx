
import { AuthContext } from '../../context/AuthContext.js';
import React, { useContext, useState} from 'react';
import { deleteCommentID, editComment, } from '../../services/post.services';
import { Button, Modal, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import './Comments.css';

/**
 * A component that displays a comment along with options to edit or delete it.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.author - The author of the comment.
 * @param {Date} props.createdOn - The creation date of the comment.
 * @param {string} props.content - The content of the comment.
 * @param {string} props.commentUserUid - The user ID of the comment's author.
 * @param {string} props.commentId - The unique ID of the comment.
 * @param {function} props.SetRefreshComments - A function to refresh the comments.
 * @param {boolean} props.refreshComments - A flag to trigger comment refreshing.
 * @param {string} props.commentPostId - The ID of the post that the comment belongs to.
 * @example
 * return (
 *   <Comment
 *     author="John Doe"
 *     createdOn={new Date()}
 *     content="This is a comment."
 *     commentUserUid="user123"
 *     commentId="comment123"
 *     SetRefreshComments={refreshFunction}
 *     refreshComments={true}
 *     commentPostId="post123"
 *   />
 * );
 */
export default function Comment ({author, createdOn, content, commentPostId, commentUserUid, commentId, SetRefreshComments, refreshComments }) {

      const { loggedInUser } = useContext(AuthContext);
      const [userId, setUserId] = useState(loggedInUser ? loggedInUser.uid : null);

      const [showEditModal, setShowEditModal] = useState(false);
      const [editedContent, setEditedContent] = useState(content);

      const handleClose = () => setShowEditModal(false);
      const handleShow = () => setShowEditModal(true);

      async function deleteComment (commentId) {
          const confirmDelete = window.confirm('Are you sure you want to delete this comment?');

          try {
            if (confirmDelete) {
                await deleteCommentID(commentId, commentPostId);
                SetRefreshComments(!refreshComments)
            }
          } catch (error) {
            console.error('Error deleting comment:', error);
          }
      }

      async function handleEditComment(commentId) {
        try {
          await editComment(commentId, editedContent);
          SetRefreshComments(!refreshComments);
          handleClose();
        } catch (error) {
          console.error('Error editing comment:', error);
        }
      }
    
      
      return (
    <div key={createdOn} className="d-flex justify-content-center mt-3">
      <div style={{ maxWidth: '96%', minWidth:'96%' }}>
    <Card>
      
      <Card.Header className="bg-light">
      <div className="d-flex justify-content-between align-items-center">
      <div>
      
        <Link to={`/account/${commentUserUid}`}>{author}</Link>
        <div className="ml-2"> {new Date(createdOn).toLocaleString()}</div>
      </div>
      
      {userId === commentUserUid && (
        <div>
          
          <button
            className="mt-1 text-link-button mr-2"
            onClick={handleShow}
          >
            Edit Comment
          </button>

          <button
            className="mt-1 text-link-button mr-2"
            onClick={() => deleteComment(commentId)}
          >
            Delete Comment
          </button>
        </div>
      )}
    </div>
    </Card.Header>
    <Card.Body>
        <Card.Text>{content}</Card.Text>
      </Card.Body>
    </Card>

    <Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          className="form-control"
          rows="5"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => handleEditComment(commentId)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

    </div>
  </div>
    );
  }

  /**
 * PropTypes for the Comment component.
 *
 * @memberof Comment
 * @static
 */

Comment.propTypes = {
     
    author: PropTypes.string,
    createdOn: PropTypes.Date,
    content: PropTypes.string,
    commentUserUid: PropTypes.string,
    commentId: PropTypes.string,
    SetRefreshComments: PropTypes.func,
    refreshComments: PropTypes.bool,
    commentPostId: PropTypes.string,
  };
  