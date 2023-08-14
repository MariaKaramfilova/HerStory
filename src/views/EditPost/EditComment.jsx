import { database } from "../config/firebase.js";
import { ref,  update, } from "firebase/database";

export const editComment = async (commentId, newContent) => {
    const commentRef = ref(database, `comments/${commentId}`);
    const editedCommentData = {
      content: newContent,
      editedOn: Date.now(), // Add the timestamp for when the comment was edited
    };
  
    try {
      await update(commentRef, editedCommentData);
      return getCommentById(commentId); // Replace this with your function to get a single comment by its ID
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  };