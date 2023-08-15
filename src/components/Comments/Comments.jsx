
import { AuthContext } from '../../context/AuthContext.js';
import React, { useContext, useState} from 'react';
import { deleteCommentID, editComment, } from '../../services/post.services';
import { Button, Modal, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import './Comments.css';

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
  