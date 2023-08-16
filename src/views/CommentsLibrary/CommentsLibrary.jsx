// eslint-disable-next-line no-unused-vars
import React from 'react'
import Comment from '../../components/Comments/Comments.jsx';
import PropTypes from "prop-types";

export default function CommentsLibrary({ commentsLibrary, refreshComments, SetRefreshComments }) {

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

  return (
    <>
      <hr />
      <h2>Comments:</h2>
      {commentsToShow}
    </>
  );
}

CommentsLibrary.propTypes = {
  refreshComments: PropTypes.bool.isRequired,
  SetRefreshComments: PropTypes.func.isRequired,
  commentsLibrary: PropTypes.array.isRequired,
};

