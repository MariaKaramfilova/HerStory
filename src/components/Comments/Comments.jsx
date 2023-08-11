
import { AuthContext } from '../../context/AuthContext.js';
import React, { useContext} from 'react';
import { deleteCommentID } from '../../services/post.services';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

export default function Comment ({author, createdOn, content, commentUserUid, commentId, SetRefreshComments, refreshComments }) {

    const { loggedInUser } = useContext(AuthContext);

    async function deleteComment (commentId) {
        const confirmDelete = window.confirm('Are you sure you want to delete this comment?');

        if (confirmDelete) {
            await deleteCommentID(commentId);
            SetRefreshComments(!refreshComments)
        }
    }

    return (
        <div key={createdOn}>

            <Link to={`/account/${commentUserUid}`}>{author}</Link>
            <p>Created On: {new Date(createdOn).toLocaleString()}</p>
            <p>{content}</p>
       
            {loggedInUser.uid === commentUserUid && 
              <Button
                type="submit"
                className='mt-1'
                variant="danger"
                onClick={() => deleteComment(commentId)}
              >
                Delete Comment
              </Button>
            } 
            <hr/>
          </div>
        )

}

Comment.propTypes = {
     
    author: PropTypes.string,
    createdOn: PropTypes.Date,
    content: PropTypes.string,
    commentUserUid: PropTypes.string,
    commentId: PropTypes.string,
    SetRefreshComments: PropTypes.func,
    refreshComments: PropTypes.bool,
  
  };
  