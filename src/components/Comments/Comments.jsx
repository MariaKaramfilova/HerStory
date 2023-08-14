
import { AuthContext } from '../../context/AuthContext.js';
import React, { useContext, useState} from 'react';
import { deleteCommentID, editComment, } from '../../services/post.services';
import { Button, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

export default function Comment ({author, createdOn, content, commentPostId, commentUserUid, commentId, SetRefreshComments, refreshComments }) {

    const { loggedInUser } = useContext(AuthContext);
    const [userId, setUserId] = useState(loggedInUser ? loggedInUser.uid : null)

    const [showEditModal, setShowEditModal] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const handleClose = () => setShowEditModal(false);
    const handleShow = () => setShowEditModal(true);

    async function deleteComment (commentId) {
        const confirmDelete = window.confirm('Are you sure you want to delete this comment?');

        if (confirmDelete) {
            await deleteCommentID(commentId, commentPostId);
            SetRefreshComments(!refreshComments)
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
      <div key={createdOn}>
        <Link to={`/account/${commentUserUid}`}>{author}</Link>
        <p>Created On: {new Date(createdOn).toLocaleString()}</p>
        <p>{content}</p>
  
        {userId === commentUserUid && (
          <div>
            <Button
              type="submit"
              className="mt-1"
              variant="danger"
              onClick={() => deleteComment(commentId)}
            >
              Delete Comment
            </Button>
            <Button
              type="submit"
              className="mt-1 ml-2"
              variant="primary"
              onClick={handleShow}
            >
              Edit Comment
            </Button>

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
        )}
        <hr />
      </div>
    );
  }
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
  