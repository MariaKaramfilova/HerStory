import { upvotePost } from "../../services/post.services";
import { downvotePost } from "../../services/post.services";
export default async function handleVote (voteType, userVote, username, postId) {
    try {
      if (voteType === "up") {
        if (userVote === "up") {
          await downvotePost(username, postId);
          userVote = null;
        } else {
          await upvotePost(username, postId);
          userVote = 'up';
        }
      } else if (voteType === "down") {
        if (userVote === "down") {
          await upvotePost(username, postId);
          userVote = null;
        } else {
          await downvotePost(username, postId);
          userVote = 'down';
        }
      }
      return userVote;
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  }